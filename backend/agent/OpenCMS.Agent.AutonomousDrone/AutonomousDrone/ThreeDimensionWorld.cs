namespace OpenCMS.Agent.AutonomousDrone;

public class ThreeDimensionWorld
{
    private readonly List<Asset> _assets;

    public ThreeDimensionWorld()
    {
        _assets = new List<Asset>();
    }

    public void AddAsset(Asset asset)
    {
        _assets.Add(asset);
    }

    public Asset GetAssetById(Guid assetId)
    {
        return _assets.FirstOrDefault(a => a.Id == assetId);
    }
}