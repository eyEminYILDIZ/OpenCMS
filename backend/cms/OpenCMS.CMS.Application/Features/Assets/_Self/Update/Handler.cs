namespace OpenCMS.CMS.Application.Assets.Self.Update;

public class Handler : IRequestHandler<Command, CommandResponse?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse?> Handle(Command request, CancellationToken cancellationToken)
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

        return new CommandResponse
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
        };
    }
}
