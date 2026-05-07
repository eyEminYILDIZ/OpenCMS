namespace OpenCMS.CMS.Application.Operations.Orders.Create;

public class Handler : IRequestHandler<Command, Order>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Order> Handle(Command request, CancellationToken cancellationToken)
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
            TargetPointSpeedKmh = request.TargetPointSpeedKmh,
            ResponsibleAssetId = request.ResponsibleAssetId,
            NextOrderId = request.NextOrderId,
            PreviousOrderId = request.PreviousOrderId,
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return order;
    }
}
