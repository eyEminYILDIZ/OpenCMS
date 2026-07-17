namespace OpenCMS.Agent.AutonomousDrone;

public class ThreeDimensionWorld
{
    private readonly List<AgentState> _agents;

    public ThreeDimensionWorld()
    {
        _agents = new List<AgentState>();
    }

    public void AddAsset(AgentState asset)
    {
        _agents.Add(asset);
    }

    public AgentState GetAssetById(Guid assetId)
    {
        return _agents.FirstOrDefault(a => a.Id == assetId);
    }
}