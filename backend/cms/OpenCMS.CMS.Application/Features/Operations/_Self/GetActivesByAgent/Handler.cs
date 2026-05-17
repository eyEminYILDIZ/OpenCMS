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
                                          .Include(x => x.OperationAssets).ThenInclude(x => x.Asset)
                                          .Include(x => x.Orders).ThenInclude(x => x.TargetOperationAsset).ThenInclude(x => x.Asset)
                                          .Include(x => x.Orders).ThenInclude(x => x.ResponsibleOperationAsset).ThenInclude(x => x.Asset)
                                          .Where(x => x.OperationAssets.Any(a => a.Asset.RelatedAgentId == request.AgentId)
                                                && (x.OperationStatus == OperationStatus.NotStarted
                                                    || x.OperationStatus == OperationStatus.InProgress
                                                    || x.OperationStatus == OperationStatus.OnHold))
                                          .ToListAsync(cancellationToken);

        System.Console.WriteLine(operations.Count);

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
            OperationAssets = o.OperationAssets.Select(a => new AssetResponse
            {
                Id = a.Id,
                AssetId = a.Asset.Id,
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
                ResponsibleOperationAssetId = or.ResponsibleOperationAssetId,
                TargetOperationAssetId = or.TargetOperationAssetId,
                NextOrderId = or.NextOrderId,
                PreviousOrderId = or.PreviousOrderId,
                TargetDatePeriodStart = or.TargetDatePeriodStart,
                TargetDatePeriodEnd = or.TargetDatePeriodEnd,
                TargetPointLatitude = or.TargetOperationAsset?.Asset.Latitude ?? or.TargetPointLatitude,
                TargetPointLongitude = or.TargetOperationAsset?.Asset.Longitude ?? or.TargetPointLongitude,
                TargetPointAltitude = or.TargetOperationAsset?.Asset.Altitude ?? or.TargetPointAltitude,
                TargetPointHeading = or.TargetOperationAsset?.Asset.Heading ?? or.TargetPointHeading,
                TargetPointSpeed = or.TargetOperationAsset?.Asset.Speed ?? or.TargetPointSpeed,
            }).ToList(),
        });
    }
}
