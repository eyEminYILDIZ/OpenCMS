namespace OpenCMS.CMS.Application.Operations.Orders.Pick;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var orderQuery = _dbContext.Orders
                                    .Where(o => o.OperationId == request.RelationId)
                                    .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            orderQuery = orderQuery.Where(o => o.Description.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var orders = await orderQuery.ToListAsync(cancellationToken);

        return orders.Select(order => new QueryResponse
        {
            Id = order.Id,
            Name = order.Description,
        }).ToList();
    }
}
