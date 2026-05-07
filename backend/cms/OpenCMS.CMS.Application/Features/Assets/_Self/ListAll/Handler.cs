namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Handler : IRequestHandler<Query, IEnumerable<Asset>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Asset>> Handle(Query request, CancellationToken cancellationToken)
    {
        var assets = await _dbContext.Assets.ToListAsync(cancellationToken);
        return assets;
    }
}
