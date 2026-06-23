namespace OpenCMS.CMS.Application.Operations.Orders.Create;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var responsibleOperationAsset = await _dbContext.OperationAssets
            .FirstOrDefaultAsync(oa => oa.OperationId == request.OperationId && oa.AssetId == request.ResponsibleOperationAssetId, cancellationToken);

        if (responsibleOperationAsset is null)
            return Result<CommandResponse>.Failure(Error.NotFound);

        var order = new Order
        {
            OperationId = request.OperationId,
            Description = request.Description,
            IssuedDate = request.IssuedDate,
            CompletedDate = request.CompletedDate,
            OrderStatus = request.OrderStatus,
            OrderType = request.OrderType,
            TargetDatePeriodStart = request.TargetDatePeriodStart,
            TargetDatePeriodEnd = request.TargetDatePeriodEnd,
            TargetPointLatitude = request.TargetPointLatitude,
            TargetPointLongitude = request.TargetPointLongitude,
            TargetPointAltitude = request.TargetPointAltitude,
            TargetPointHeading = request.TargetPointHeading,
            TargetPointSpeed = request.TargetPointSpeed,
            ResponsibleOperationAssetId = responsibleOperationAsset.Id,
            NextOrderId = request.NextOrderId,
            PreviousOrderId = request.PreviousOrderId,
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommandResponse
        {
            Id = order.Id,
            OperationId = order.OperationId,
            Description = order.Description,
            IssuedDate = order.IssuedDate,
            CompletedDate = order.CompletedDate,
            OrderStatus = order.OrderStatus,
            OrderType = order.OrderType,
            TargetDatePeriodStart = order.TargetDatePeriodStart,
            TargetDatePeriodEnd = order.TargetDatePeriodEnd,
            TargetPointLatitude = order.TargetPointLatitude,
            TargetPointLongitude = order.TargetPointLongitude,
            TargetPointAltitude = order.TargetPointAltitude,
            TargetPointHeading = order.TargetPointHeading,
            TargetPointSpeed = order.TargetPointSpeed,
            ResponsibleOperationAssetId = order.ResponsibleOperationAssetId,
            NextOrderId = order.NextOrderId,
            PreviousOrderId = order.PreviousOrderId,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}
