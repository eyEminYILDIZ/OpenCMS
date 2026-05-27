namespace OpenCMS.CMS.Application.Agents.Self.GetItemCounts;

public class Handler : IRequestHandler<Query, Result<QueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<QueryResponse>> Handle(Query request, CancellationToken cancellationToken)
    {
        var activeCount = await _dbContext.Agents.CountAsync(a => a.IsActive, cancellationToken);
        var inactiveCount = await _dbContext.Agents.CountAsync(a => !a.IsActive, cancellationToken);

        return new QueryResponse
        {
            ActiveCount = activeCount,
            InactiveCount = inactiveCount
        };
    }
}
