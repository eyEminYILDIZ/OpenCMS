namespace OpenCMS.Agent.AirDefenceGun;

public class DefenceGun
{
    private readonly AgentState _selfAgent;
    private readonly ILogger<DefenceGun> _logger;

    public DefenceGun(AgentState selfAgent, ILogger<DefenceGun> logger)
    {
        _selfAgent = selfAgent;
        _logger = logger;
    }

    public async Task TakePosition(Asset targetAsset)
    {

        // calculate heading
        var heading = CoordinateCalculator.CalculateHeading(_selfAgent.Latitude, _selfAgent.Longitude, targetAsset.Latitude, targetAsset.Longitude);
        _selfAgent.UpdateState(_selfAgent.Latitude, _selfAgent.Longitude, _selfAgent.Altitude, heading, _selfAgent.Speed);

        _logger.LogInformation("Positioned Heading:{Heading} to target {AssetId} at {Latitude}/{Longitude}/{Altitude}",
           heading, targetAsset.Id, targetAsset.Latitude, targetAsset.Longitude, targetAsset.Altitude);

        await Task.Delay(1000);
    }

    public async Task Fire()
    {
        await Task.Delay(100);
        _logger.LogWarning("FIRED at target");
    }
}

