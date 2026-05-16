namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Handler : IRequestHandler<Query, IEnumerable<QueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<QueryResponse>> Handle(Query request, CancellationToken cancellationToken)
    {
        var assets = await _dbContext.Assets.ToListAsync(cancellationToken);

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
        });
    }
}
