using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace OpenCMS.Agent.AutonomousDrone
{
    public class AutonomousDrone
    {
        private readonly AgentState _selfAgent;
        private readonly ILogger<AutonomousDrone> _logger;
        private List<Point> _waypoints = new List<Point>();

        public AutonomousDrone(AgentState selfAgent, ILogger<AutonomousDrone> logger)
        {
            _selfAgent = selfAgent;
            _logger = logger;
        }

        public async Task TakePosition(Asset targetAsset)
        {
            await Task.CompletedTask;
            // await Task.Delay(1000);
            // _logger.LogInformation("Positioned to target {AssetId} at {Latitude}/{Longitude}/{Altitude}",
            //     targetAsset.Id, targetAsset.Latitude, targetAsset.Longitude, targetAsset.Altitude);
        }

        public async Task Fire()
        {
            await Task.CompletedTask;
            // await Task.Delay(100);
            // _logger.LogWarning("FIRED at target");
        }
    }
}
