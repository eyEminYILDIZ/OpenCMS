namespace OpenCMS.CMS.Application.Assets.Self.Feed;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ILogger<Handler> _logger;
    private readonly IAgentSocketService _agentSocketService;

    public Handler(IApplicationDbContext dbContext, ILogger<Handler> logger, IAgentSocketService agentSocketService)
    {
        _dbContext = dbContext;
        _logger = logger;
        _agentSocketService = agentSocketService;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
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
                Speed = request.Speed,
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
            asset.Speed = request.Speed;
            asset.AssetType = request.AssetType;
            asset.ThreatType = request.ThreatType;
            asset.IsActive = request.IsActive;
            asset.LastUpdated = DateTime.UtcNow;
            asset.RelatedAgentId = request.RelatedAgentId;

            _dbContext.Assets.Update(asset);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Asset with ID {AssetId} has been processed. Name: {AssetName}, Latitude: {Latitude}, Longitude: {Longitude}, Altitude: {Altitude}, Heading: {Heading}, Speed: {Speed}, AssetType: {AssetType}, ThreatType: {ThreatType}, IsActive: {IsActive}, RelatedAgentId: {RelatedAgentId}",
            asset.Id, asset.Name, asset.Latitude, asset.Longitude, asset.Altitude, asset.Heading, asset.Speed, asset.AssetType, asset.ThreatType, asset.IsActive, asset.RelatedAgentId);

        var response = new CommandResponse
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

        await _agentSocketService.AssetUpdated(response, cancellationToken);

        return response;
    }
}
