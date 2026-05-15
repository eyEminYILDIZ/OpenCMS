namespace OpenCMS.CMS.Application.Assets.Self.Create;

public class Handler : IRequestHandler<Command, Asset>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Asset> Handle(Command request, CancellationToken cancellationToken)
    {
        var asset = new Asset
        {
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Altitude = request.Altitude,
            Heading = request.Heading,
            Speed = request.SpeedKmh,
            AssetType = request.AssetType,
            ThreatType = request.ThreatType,
            IsActive = request.IsActive,
            FirstUpdated = DateTime.UtcNow,
            LastUpdated = DateTime.UtcNow
        };

        _dbContext.Assets.Add(asset);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return asset;
    }
}
