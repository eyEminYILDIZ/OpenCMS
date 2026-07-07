namespace OpenCMS.CMS.Application.Operations.Self.GetById;

public class Handler : IRequestHandler<Query, Result<ResponseModel>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<ResponseModel>> Handle(Query request, CancellationToken cancellationToken)
    {
        var operation = await _dbContext.Operations
                                            .Include(o => o.Orders)
                                            .Include(o => o.OperationAssets).ThenInclude(a => a.Asset)
                                            .FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (operation == null)
            return Error.NotFound;

        var dispatches = await _dbContext.Dispatches
                                          .Include(d => d.ProviderAgent)
                                          .Where(d => d.RelatedEntityId == operation.Id)
                                          .OrderByDescending(d => d.OccuredAt)
                                          .ToListAsync(cancellationToken);

        return new ResponseModel
        {
            Id = operation.Id,
            Name = operation.Name,
            Description = operation.Description,
            StartDate = operation.StartDate,
            EstimatedEndDate = operation.EstimatedEndDate,
            EndDate = operation.EndDate,
            OperationStatus = operation.OperationStatus,
            OperationType = operation.OperationType,
            Orders = operation.Orders?.Select(o => new OrderResponse
            {
                Id = o.Id,
                Description = o.Description,
                IssuedDate = o.IssuedDate,
                CompletedDate = o.CompletedDate,
                OrderStatus = o.OrderStatus,
                OrderType = o.OrderType,
                TargetDatePeriodStart = o.TargetDatePeriodStart,
                TargetDatePeriodEnd = o.TargetDatePeriodEnd,
                TargetPointLatitude = o.TargetPointLatitude,
                TargetPointLongitude = o.TargetPointLongitude,
                TargetPointAltitude = o.TargetPointAltitude,
                TargetPointHeading = o.TargetPointHeading,
                TargetPointSpeed = o.TargetPointSpeed,
                ResponsibleOperationAssetId = o.ResponsibleOperationAssetId,
                NextOrderId = o.NextOrderId,
                PreviousOrderId = o.PreviousOrderId,
                TargetOperationAssetId = o.TargetOperationAssetId
            }).ToList() ?? new(),
            OperationAssets = operation.OperationAssets?.Select(a => new OperationAssetResponse
            {
                Id = a.Id,
                AssetId = a.AssetId,
                Asset = new AssetResponse
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
                    FirstUpdated = a.Asset.FirstUpdated,
                    LastUpdated = a.Asset.LastUpdated,
                    IsActive = a.Asset.IsActive,
                    RelatedAgentId = a.Asset.RelatedAgentId
                }
            }).ToList() ?? new(),
            Dispatches = dispatches.Select(d => new DispatchResponse
            {
                Id = d.Id,
                Title = d.Title,
                Description = d.Description,
                Category = d.Category,
                OccuredAt = d.OccuredAt,
                RelatedEntityId = d.RelatedEntityId,
                RelatedChildEntityId = d.RelatedChildEntityId,
                ProviderAgentId = d.ProviderAgentId,
                ProviderAgentName = d.ProviderAgent.Name,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            }).ToList()
        };
    }
}
