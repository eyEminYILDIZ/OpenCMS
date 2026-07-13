using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using OpenCMS.Agent.AutonomousDrone.Models;
using OpenCMS.Agent.Library.Utilities;

namespace OpenCMS.Agent.AutonomousDrone
{
    public class AutonomousDrone
    {
        private readonly AgentState _selfAgent;
        private readonly ActuatorSystem _actuatorSystem;
        private readonly SensorSystem _sensorSystem;
        private readonly ILogger<AutonomousDrone> _logger;
        private List<SteerPoint> _steerPoints = new List<SteerPoint>();
        private int _currentSteerPointIndex = 0;
        private SteerPoint _homeSteerPoint;
        private bool _loggingEnabled = false;

        public AutonomousDrone(AgentState selfAgent, ThreeDimensionWorld world, ILogger<AutonomousDrone> logger, bool loggingEnabled = false)
        {
            _selfAgent = selfAgent;
            _logger = logger;
            _currentSteerPointIndex = 0;
            _loggingEnabled = loggingEnabled;
            _actuatorSystem = new ActuatorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
            _sensorSystem = new SensorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
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

        // Steer point related works

        public async Task ChangeSteerPoint()
        {
            if (_steerPoints.Count == 0)
            {
                _logger.LogWarning("No steer points available.");
                return;
            }

            if (_currentSteerPointIndex == -1)
            {
                _currentSteerPointIndex = -2;
                return;
            }

            if (_steerPoints.Count == _currentSteerPointIndex + 1)
            {
                _logger.LogInformation("No more steer points available. Returning to home position.");
                _currentSteerPointIndex = -1;
                return;
            }

            _currentSteerPointIndex++;
        }

        public SteerPoint GetCurrentSteerPoint()
        {
            if (_currentSteerPointIndex == -1)
            {
                return _homeSteerPoint;
            }

            if (_currentSteerPointIndex == -2)
            {
                return null;
            }

            if (_steerPoints.Count == 0 || _currentSteerPointIndex >= _steerPoints.Count)
            {
                _logger.LogWarning("No steer points available.");
                return null;
            }

            return _steerPoints[_currentSteerPointIndex];
        }

        public async Task Start()
        {
            // save home position
            var latitude = _sensorSystem.GetLatitude();
            var longitude = _sensorSystem.GetLongitude();
            var altitude = _sensorSystem.GetAltitude();
            var heading = _sensorSystem.GetHeading();
            var speed = _sensorSystem.GetSpeed();
            _homeSteerPoint = new SteerPoint("Home Waypoint", latitude, longitude, altitude, heading, speed);
        }

        public async Task<bool> Work()
        {
            var currentSteerPoint = GetCurrentSteerPoint();
            if (currentSteerPoint == null)
            {
                _logger.LogWarning("No current steer point available.");
                return false;
            }

            if (_loggingEnabled)
            {
                System.Console.WriteLine($"Target Steer Point: {currentSteerPoint.Name}");
                System.Console.WriteLine($"Target  => Lat: {currentSteerPoint.Latitude} \tLon: {currentSteerPoint.Longitude} \tAlt: {currentSteerPoint.Altitude} \tHeading: {currentSteerPoint.Heading} \tSpeed: {currentSteerPoint.Speed}");
                System.Console.WriteLine($"Current => Lat: {_sensorSystem.GetLatitude()} \tLon: {_sensorSystem.GetLongitude()} \tAlt: {_sensorSystem.GetAltitude()} \tHeading: {_sensorSystem.GetHeading()} \tSpeed: {_sensorSystem.GetSpeed()}");
            }

            var headingChanged = false;
            var bearing = 0.0;
            // make turn if needed
            do
            {
                bearing = CoordinateUtils.CalculateHeading(_sensorSystem.GetLatitude(), _sensorSystem.GetLongitude(), currentSteerPoint.Latitude, currentSteerPoint.Longitude);
                var headingDifference = bearing - _sensorSystem.GetHeading();
                if (headingDifference > 0)
                {
                    await _actuatorSystem.TurnRight();
                    headingChanged = true;
                }
                else if (headingDifference < 0)
                {
                    await _actuatorSystem.TurnLeft();
                    headingChanged = true;
                }
            } while (Math.Abs(bearing - _sensorSystem.GetHeading()) > 1);

            // make altitude adjustment if needed
            var altitudeChanged = false;
            do
            {
                var altitudeDifference = currentSteerPoint.Altitude - _sensorSystem.GetAltitude();
                if (altitudeDifference > 0)
                {
                    await _actuatorSystem.MoveUp();
                    altitudeChanged = true;
                }
                else if (altitudeDifference < 0)
                {
                    await _actuatorSystem.MoveDown();
                    altitudeChanged = true;
                }
            } while (Math.Abs(currentSteerPoint.Altitude - _sensorSystem.GetAltitude()) > 1);

            // Move towards the current steer point if needed
            var positionChanged = false;
            var distance = CoordinateUtils.CalculateDistance(_sensorSystem.GetLatitude(), _sensorSystem.GetLongitude(), currentSteerPoint.Latitude, currentSteerPoint.Longitude);
            if (distance > 1)
            {
                await _actuatorSystem.MoveForward();
                positionChanged = true;
            }

            // Update the agent's state based on the sensor readings
            var latitude = _sensorSystem.GetLatitude();
            var longitude = _sensorSystem.GetLongitude();
            var altitude = _sensorSystem.GetAltitude();
            var heading = _sensorSystem.GetHeading();
            var speed = _sensorSystem.GetSpeed();
            _selfAgent.UpdateState(latitude, longitude, altitude, heading, speed);

            if (distance <= 10)
            {
                _logger.LogInformation("Reached steer point {SteerPointIndex}.", _currentSteerPointIndex);
                await ChangeSteerPoint();
            }

            return true;
        }

    }
}
