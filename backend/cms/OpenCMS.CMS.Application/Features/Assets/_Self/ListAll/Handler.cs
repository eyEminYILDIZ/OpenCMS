namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var assetQuery = _dbContext.Assets.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            assetQuery = assetQuery.Where(a => a.Name.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var assets = await assetQuery.ToListAsync(cancellationToken);

        return assets.Select(asset => new QueryResponse
        {
            Id = asset.Id,
            Name = asset.Name,
            Latitude = asset.Latitude,
            Longitude = asset.Longitude,
            Altitude = asset.Altitude,
            Heading = asset.Heading,
            Speed = asset.Speed,
            AssetType = asset.AssetType,
            ThreatType = asset.ThreatType,
            IsActive = asset.IsActive,
            FirstUpdated = asset.FirstUpdated,
            LastUpdated = asset.LastUpdated,
            RelatedAgentId = asset.RelatedAgentId,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt
        }).ToList();
    }
}
