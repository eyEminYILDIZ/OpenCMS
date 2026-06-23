namespace OpenCMS.CMS.Application.Operations.OperationAssets.Pick;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var assetQuery = _dbContext.OperationAssets
                                    .Include(o => o.Asset)
                                    .Where(o => o.OperationId == request.RelationId)
                                    .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            assetQuery = assetQuery.Where(a => a.Asset.Name.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var assets = await assetQuery.ToListAsync(cancellationToken);

        return assets.Select(asset => new QueryResponse
        {
            Id = asset.Id,
            Name = asset.Asset.Name,
        }).ToList();
    }
}
