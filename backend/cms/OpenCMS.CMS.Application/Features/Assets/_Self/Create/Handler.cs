namespace OpenCMS.CMS.Application.Assets.Self.Create;

public class Handler : IRequestHandler<Command, CommandResponse>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse> Handle(Command request, CancellationToken cancellationToken)
    {
        var asset = new Asset
        {
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Altitude = request.Altitude,
            Heading = request.Heading,
            Speed = request.Speed,
            AssetType = request.AssetType,
            ThreatType = request.ThreatType,
            IsActive = request.IsActive,
            FirstUpdated = DateTime.UtcNow,
            LastUpdated = DateTime.UtcNow
        };

        _dbContext.Assets.Add(asset);
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
