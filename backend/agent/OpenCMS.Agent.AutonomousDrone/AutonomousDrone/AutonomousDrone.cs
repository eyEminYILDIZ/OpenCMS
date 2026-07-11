using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using OpenCMS.Agent.AutonomousDrone.Models;

namespace OpenCMS.Agent.AutonomousDrone
{
    public class AutonomousDrone
    {
        private readonly AgentState _selfAgent;
        private readonly ILogger<AutonomousDrone> _logger;
        private List<SteerPoint> _steerPoints = new List<SteerPoint>();
        private int _currentSteerPointIndex = 0;
        private SteerPoint _homeSteerPoint;

        public AutonomousDrone(AgentState selfAgent, ILogger<AutonomousDrone> logger)
        {
            _selfAgent = selfAgent;
            _logger = logger;
            _currentSteerPointIndex = 0;
        }

        public void SetSteerPoints(List<SteerPoint> steerPoints)
        {
            _steerPoints = steerPoints;
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

        public async Task Start()
        {
            _homeSteerPoint = new SteerPoint(0, 0, 0, 0, 0);
        }

        public async Task Work()
        {

        }

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////// Movement System /////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

    }
}
