using System.Threading.Tasks;

namespace OpenCMS.Agent.AutonomousDrone;

public class ActuatorSystem
{
    private double _horizontalSpeed = 0.0;
    private double _verticalSpeed = 0.0;

    private readonly ThreeDimensionWorld _world;

    private readonly Guid _assetId;

    public ActuatorSystem(ThreeDimensionWorld world, Guid assetId)
    {
        _world = world;
        _assetId = assetId;
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
    }

    public async Task MoveForward()
    {
        await Task.CompletedTask;
    }

    public async Task MoveBackward()
    {
        await Task.CompletedTask;
    }

    public async Task MoveUp()
    {
        await Task.CompletedTask;
    }

    public async Task MoveDown()
    {
        await Task.CompletedTask;
    }

    public async Task HorizontalSpeedUp()
    {
        await Task.CompletedTask;
    }

    public async Task HorizontalSpeedDown()
    {
        await Task.CompletedTask;
    }

    public async Task VerticalSpeedUp()
    {
        await Task.CompletedTask;
    }

    public async Task VerticalSpeedDown()
    {
        await Task.CompletedTask;
    }
}