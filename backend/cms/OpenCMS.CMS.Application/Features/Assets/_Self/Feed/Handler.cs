namespace OpenCMS.CMS.Application.Assets.Self.Feed;

public class Handler : IRequestHandler<Command, Asset?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Asset?> Handle(Command request, CancellationToken cancellationToken)
    {
        var asset = await _dbContext.Assets.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (asset == null)
        {
            asset = new Asset
            {
                Id = request.Id,
                Name = request.Name,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Altitude = request.Altitude,
                Heading = request.Heading,
                SpeedKmh = request.Speed,
                AssetType = request.AssetType,
                ThreatType = request.ThreatType,
                IsActive = request.IsActive,
                LastUpdated = DateTime.UtcNow,
                RelatedAgentId = request.RelatedAgentId
            };
            _dbContext.Assets.Add(asset);
        }
        else
        {
            asset.Name = request.Name;
            asset.Latitude = request.Latitude;
            asset.Longitude = request.Longitude;
            asset.Altitude = request.Altitude;
            asset.Heading = request.Heading;
            asset.SpeedKmh = request.Speed;
            asset.AssetType = request.AssetType;
            asset.ThreatType = request.ThreatType;
            asset.IsActive = request.IsActive;
            asset.LastUpdated = DateTime.UtcNow;
            asset.RelatedAgentId = request.RelatedAgentId;

            _dbContext.Assets.Update(asset);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return asset;
    }
}
