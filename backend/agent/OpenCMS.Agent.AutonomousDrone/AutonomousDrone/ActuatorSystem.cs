namespace OpenCMS.Agent.AutonomousDrone;

public class ActuatorSystem
{
    private double _horizontalSpeed = 0.0;
    private double _verticalSpeed = 0.0;
    private bool _logginEnabled = false;

    private readonly ThreeDimensionWorld _world;

    private readonly Guid _assetId;

    public ActuatorSystem(ThreeDimensionWorld world, Guid assetId, bool logginEnabled = false)
    {
        _world = world;
        _assetId = assetId;
        _logginEnabled = logginEnabled;
    }

    public async Task TurnRight()
    {
        await Task.CompletedTask;

        var currentHeading = _world.GetAssetById(_assetId)?.Heading ?? 0;
        var newHeading = (currentHeading + 1) % 360;

        var asset = _world.GetAssetById(_assetId);
        if (asset != null)
        {
            asset.Heading = newHeading;
        }

        if (_logginEnabled)
        {
            Console.WriteLine($"Turned right. New heading: {newHeading} degrees");
        }
    }

    public async Task TurnLeft()
    {
        await Task.CompletedTask;

        var currentHeading = _world.GetAssetById(_assetId)?.Heading ?? 0;
        var newHeading = (currentHeading - 1 + 360) % 360;

        var asset = _world.GetAssetById(_assetId);
        if (asset != null)
        {
            asset.Heading = newHeading;
        }

        if (_logginEnabled)
        {
            Console.WriteLine($"Turned left. New heading: {newHeading} degrees");
        }
    }

    public async Task MoveForward()
    {
        await Task.CompletedTask;

        const double EarthRadiusMeters = 6371000;
        const double distanceMeters = 10.0;

        var asset = _world.GetAssetById(_assetId);
        if (asset == null)
        {
            return;
        }

        var headingRad = asset.Heading * Math.PI / 180.0;
        var lat1Rad = asset.Latitude * Math.PI / 180.0;
        var lon1Rad = asset.Longitude * Math.PI / 180.0;
        var angularDistance = distanceMeters / EarthRadiusMeters;

        var lat2Rad = Math.Asin(
            Math.Sin(lat1Rad) * Math.Cos(angularDistance) +
            Math.Cos(lat1Rad) * Math.Sin(angularDistance) * Math.Cos(headingRad));

        var lon2Rad = lon1Rad + Math.Atan2(
            Math.Sin(headingRad) * Math.Sin(angularDistance) * Math.Cos(lat1Rad),
            Math.Cos(angularDistance) - Math.Sin(lat1Rad) * Math.Sin(lat2Rad));

        asset.Latitude = lat2Rad * 180.0 / Math.PI;
        asset.Longitude = lon2Rad * 180.0 / Math.PI;

        if (_logginEnabled)
        {
            Console.WriteLine($"Moved forward. New position: Latitude {asset.Latitude}, Longitude {asset.Longitude}");
        }
    }

    public async Task MoveUp()
    {
        await Task.CompletedTask;

        var currentAltitude = _world.GetAssetById(_assetId)?.Altitude ?? 0;
        var newAltitude = currentAltitude + 1;

        var asset = _world.GetAssetById(_assetId);
        if (asset != null)
        {
            asset.Altitude = newAltitude;
        }

        if (_logginEnabled)
        {
            Console.WriteLine($"Moved up. New altitude: {newAltitude}");
        }
    }

    public async Task MoveDown()
    {
        await Task.CompletedTask;

        var currentAltitude = _world.GetAssetById(_assetId)?.Altitude ?? 0;
        var newAltitude = currentAltitude - 1;

        var asset = _world.GetAssetById(_assetId);
        if (asset != null)
        {
            asset.Altitude = newAltitude;
        }

        if (_logginEnabled)
        {
            Console.WriteLine($"Moved down. New altitude: {newAltitude}");
        }
    }
}