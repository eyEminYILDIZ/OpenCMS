using Microsoft.Extensions.Logging;

namespace OpenCMS.Agent.AirDefenceGun
{
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
            await Task.Delay(1000);
            _logger.LogInformation("Positioned to target {AssetId} at {Latitude}/{Longitude}/{Altitude}",
                targetAsset.Id, targetAsset.Latitude, targetAsset.Longitude, targetAsset.Altitude);
        }

        public async Task Fire()
        {
            await Task.Delay(100);
            _logger.LogWarning("FIRED at target");
        }
    }
}
