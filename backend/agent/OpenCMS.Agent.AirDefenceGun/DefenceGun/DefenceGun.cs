using Microsoft.Extensions.Logging;
using OpenCMS.Agent.Library.Utilities;

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
            var selfAsset = _selfAgent.GetSelfAsset();

            // calculate heading
            var heading = CoordinateUtils.CalculateHeading(selfAsset.Latitude, selfAsset.Longitude, targetAsset.Latitude, targetAsset.Longitude);
            _selfAgent.UpdateState(selfAsset.Latitude, selfAsset.Longitude, selfAsset.Altitude, heading, selfAsset.Speed);

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
}
