namespace OpenCMS.CMS.Application.Assets.Self.Update;

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
            return null;

        asset.Name = request.Name;
        asset.Latitude = request.Latitude;
        asset.Longitude = request.Longitude;
        asset.Altitude = request.Altitude;
        asset.Heading = request.Heading;
        asset.Speed = request.SpeedKmh;
        asset.AssetType = request.AssetType;
        asset.ThreatType = request.ThreatType;
        asset.IsActive = request.IsActive;
        asset.LastUpdated = DateTime.UtcNow;

        _dbContext.Assets.Update(asset);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return asset;
    }
}
