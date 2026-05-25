namespace OpenCMS.CMS.Application.Operations.Orders.Update;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (order == null)
            return Error.NotFound;

        order.Description = request.Description;
        order.IssuedDate = request.IssuedDate;
        order.CompletedDate = request.CompletedDate;
        order.OrderStatus = request.OrderStatus;
        order.OrderType = request.OrderType;
        order.TargetDatePeriodStart = request.TargetDatePeriodStart;
        order.TargetDatePeriodEnd = request.TargetDatePeriodEnd;
        order.TargetPointLatitude = request.TargetPointLatitude;
        order.TargetPointLongitude = request.TargetPointLongitude;
        order.TargetPointAltitude = request.TargetPointAltitude;
        order.TargetPointHeading = request.TargetPointHeading;
        order.TargetPointSpeed = request.TargetPointSpeed;
        order.ResponsibleOperationAssetId = request.ResponsibleAssetId;
        order.NextOrderId = request.NextOrderId;
        order.PreviousOrderId = request.PreviousOrderId;

        _dbContext.Orders.Update(order);
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
            ResponsibleAssetId = order.ResponsibleOperationAssetId,
            NextOrderId = order.NextOrderId,
            PreviousOrderId = order.PreviousOrderId,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}
