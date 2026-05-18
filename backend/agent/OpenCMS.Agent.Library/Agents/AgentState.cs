using OpenCMS.CMS.Domain.Entities;

namespace OpenCMS.Agent.Library;

public class AgentState
{
    private readonly Asset _selfAsset;
    public AgentState(Guid agentId, Guid assetId, string name, AssetTypes assetType, ThreatTypes threatType)
    {
        _selfAsset = new Asset
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

    public Asset GetSelfAsset()
    {
        return _selfAsset;
    }
}