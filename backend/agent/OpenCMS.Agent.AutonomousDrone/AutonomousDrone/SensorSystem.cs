namespace OpenCMS.Agent.AutonomousDrone;

public class SensorSystem
{

    private readonly ThreeDimensionWorld _world;
    private readonly Guid _assetId;
    private readonly bool _loggingEnabled;

    public SensorSystem(ThreeDimensionWorld world, Guid assetId, bool loggingEnabled = false)
    {
        _world = world;
        _assetId = assetId;
        _loggingEnabled = loggingEnabled;
    }

    public double GetHeading()
    {
        // Placeholder for actual heading calculation logic
        return _world.GetAssetById(_assetId)?.Heading ?? 0;
    }

    public double GetLatitude()
    {
        return _world.GetAssetById(_assetId)?.Latitude ?? 0;
    }

    public double GetLongitude()
    {
        return _world.GetAssetById(_assetId)?.Longitude ?? 0;
    }

    public double GetAltitude()
    {
        return _world.GetAssetById(_assetId)?.Altitude ?? 0;
    }

    public double GetSpeed()
    {
        return _world.GetAssetById(_assetId)?.GroundSpeed ?? 0;
    }
}