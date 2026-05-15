namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Handler : IRequestHandler<Query, IEnumerable<QueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<QueryResponse>> Handle(Query request, CancellationToken cancellationToken)
    {
        var operations = await _dbContext.Operations
                                          .Include(x => x.Assets).ThenInclude(x => x.Asset)
                                          .Include(x => x.Orders)
                                          .Where(x => x.Assets.Any(a => a.Asset.RelatedAgentId == request.AgentId)
                                                && (x.OperationStatus == OperationStatus.NotStarted
                                                    || x.OperationStatus == OperationStatus.InProgress
                                                    || x.OperationStatus == OperationStatus.OnHold))
                                          .ToListAsync(cancellationToken);

        return operations.Select(o => new QueryResponse
        {
            Id = o.Id,
            Name = o.Name,
            Description = o.Description,
            StartDate = o.StartDate,
            EstimatedEndDate = o.EstimatedEndDate,
            EndDate = o.EndDate,
            OperationStatus = o.OperationStatus,
            OperationType = o.OperationType,
            Assets = o.Assets.Select(a => new AssetResponse
            {
                Id = a.Asset.Id,
                Name = a.Asset.Name,
                Latitude = a.Asset.Latitude,
                Longitude = a.Asset.Longitude,
                Altitude = a.Asset.Altitude,
                Heading = a.Asset.Heading,
                Speed = a.Asset.Speed,
                AssetType = a.Asset.AssetType,
                ThreatType = a.Asset.ThreatType,
                RelatedAgentId = a.Asset.RelatedAgentId,
            }).ToList(),
            Orders = o.Orders.Select(or => new OrderResponse
            {
                Id = or.Id,
                Description = or.Description,
                IssuedDate = or.IssuedDate,
                CompletedDate = or.CompletedDate,
                OrderStatus = or.OrderStatus,
                OrderType = or.OrderType,
                OperationId = or.OperationId,
                TargetDatePeriodStart = or.TargetDatePeriodStart,
                TargetDatePeriodEnd = or.TargetDatePeriodEnd,
                TargetPointLatitude = or.TargetPointLatitude,
                TargetPointLongitude = or.TargetPointLongitude,
                TargetPointAltitude = or.TargetPointAltitude,
                TargetPointHeading = or.TargetPointHeading,
                TargetPointSpeedKmh = or.TargetPointSpeedKmh,
                ResponsibleAssetId = or.ResponsibleAssetId,
                NextOrderId = or.NextOrderId,
                PreviousOrderId = or.PreviousOrderId,
            }).ToList(),
        });
    }
}
