namespace OpenCMS.CMS.Application.Operations.Orders.Create;

public class Handler : IRequestHandler<Command, CommandResponse>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse> Handle(Command request, CancellationToken cancellationToken)
    {
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
            ResponsibleAssetId = request.ResponsibleAssetId,
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
            ResponsibleAssetId = order.ResponsibleAssetId,
            NextOrderId = order.NextOrderId,
            PreviousOrderId = order.PreviousOrderId,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}
