namespace OpenCMS.CMS.Application.Dispatches.Self.GetItemCounts;

public class Handler : IRequestHandler<Query, Result<QueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<QueryResponse>> Handle(Query request, CancellationToken cancellationToken)
    {
        var totalCount = await _dbContext.Dispatches.CountAsync(cancellationToken);

        return new QueryResponse
        {
            TotalCount = totalCount
        };
    }
}
