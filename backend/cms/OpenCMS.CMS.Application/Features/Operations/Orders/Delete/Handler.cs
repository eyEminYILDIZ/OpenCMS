namespace OpenCMS.CMS.Application.Operations.Orders.Delete;

public class Handler : IRequestHandler<Command, CommandResponse?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse?> Handle(Command request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (order == null)
            return null;

        _dbContext.Orders.Remove(order);
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
            ResponsibleAssetId = order.ResponsibleAssetId,
            NextOrderId = order.NextOrderId,
            PreviousOrderId = order.PreviousOrderId,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}
