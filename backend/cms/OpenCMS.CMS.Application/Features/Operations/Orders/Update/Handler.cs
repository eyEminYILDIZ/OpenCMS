namespace OpenCMS.CMS.Application.Operations.Orders.Update;

public class Handler : IRequestHandler<Command, Order?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Order?> Handle(Command request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (order == null)
            return null;

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
        order.TargetPointSpeedKmh = request.TargetPointSpeedKmh;
        order.ResponsibleAssetId = request.ResponsibleAssetId;
        order.NextOrderId = request.NextOrderId;
        order.PreviousOrderId = request.PreviousOrderId;

        _dbContext.Orders.Update(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return order;
    }
}
