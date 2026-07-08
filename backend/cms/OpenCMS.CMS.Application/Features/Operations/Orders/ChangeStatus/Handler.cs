namespace OpenCMS.CMS.Application.Operations.Orders.ChangeStatus;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == request.Id && o.OperationId == request.OperationId, cancellationToken);

        if (order == null)
            return Error.NotFound;

        order.OrderStatus = request.OrderStatus;

        _dbContext.Orders.Update(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommandResponse
        {
            Id = order.Id,
            OperationId = order.OperationId,
            Code = order.Code,
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
