namespace OpenCMS.Agent.AirRadar;

public class AgentState
{
    private readonly AssetContract _selfAsset;
    public AgentState()
    {
        _selfAsset = new AssetContract
        {
            Id = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6"),
            Name = "Air Radar Agent",
            Latitude = 37.7749,
            Longitude = 41.4194,
            Altitude = 100,
            Heading = 205,
            Speed = 0,
            AssetType = AssetTypesContract.Vehicle,
            ThreatType = ThreatTypesContract.Own
        };
    }

    public AssetContract GetSelfAsset()
    {
        return _selfAsset;
    }
}