using OpenCMS.Agent.Library.Models;

namespace OpenCMS.Agent.Library;

public class AgentState
{
    private readonly AssetContract _selfAsset;
    public AgentState(Guid agentId, Guid assetId, string name, AssetTypesContract assetType, ThreatTypesContract threatType)
    {
        _selfAsset = new AssetContract
        {
            Id = assetId,
            RelatedAgentId = agentId,
            Name = name,
            Latitude = 0,
            Longitude = 0,
            Altitude = 0,
            Heading = 0,
            Speed = 0,
            AssetType = assetType,
            ThreatType = threatType
        };
    }

    public void UpdateState(double latitude, double longitude, double altitude, double heading, double speed)
    {
        _selfAsset.Latitude = latitude;
        _selfAsset.Longitude = longitude;
        _selfAsset.Altitude = altitude;
        _selfAsset.Heading = heading;
        _selfAsset.Speed = speed;
    }

    public AssetContract GetSelfAsset()
    {
        return _selfAsset;
    }
}