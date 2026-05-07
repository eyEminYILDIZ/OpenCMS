namespace OpenCMS.CMS.Application.Assets.Self.GetById;

public class Handler : IRequestHandler<Query, Asset?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Asset?> Handle(Query request, CancellationToken cancellationToken)
    {
        var asset = await _dbContext.Assets.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
        return asset;
    }
}
