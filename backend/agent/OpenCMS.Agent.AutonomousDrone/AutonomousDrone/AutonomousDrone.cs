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
        private List<WayPoint> _steerPoints = new List<WayPoint>();
        private int _currentSteerPointIndex = 0;
        private WayPoint _homeSteerPoint;
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

        public void SetSteerPoints(List<WayPoint> steerPoints)
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

        public WayPoint GetCurrentSteerPoint()
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
            _homeSteerPoint = new WayPoint("Home Waypoint", latitude, longitude, altitude, heading, speed, OrderTypes.Move);
        }


        bool isCirclingCompleted = false;
        bool isCircling = false;
        bool isOrderTypeObserve = false;// currentSteerPoint.OrderType == OrderTypes.Observe;
        int circleCount = 0;

        public async Task<bool> Work(CancellationToken cancellationToken)
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

            isOrderTypeObserve = currentSteerPoint.OrderType == OrderTypes.Observe;
            var headingChanged = false;
            var bearing = 0.0;

            // make turn if needed
            bearing = CoordinateUtils.CalculateHeading(_sensorSystem.GetLatitude(), _sensorSystem.GetLongitude(), currentSteerPoint.Latitude, currentSteerPoint.Longitude);

            if (isCircling)
                bearing = (bearing - 90 + 360) % 360;

            do
            {
                var headingDifference = 0.0;
                headingDifference = bearing - _sensorSystem.GetHeading();

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
                if (_loggingEnabled)
                {
                    System.Console.WriteLine($"Calculations: IsCircling: {isCircling}  | Difference: {headingDifference} | Bearing: {bearing} | Heading: {_sensorSystem.GetHeading()} ");
                }

                // await Task.Delay(100, cancellationToken);
            } while (Math.Abs(bearing - _sensorSystem.GetHeading()) > 1 && !cancellationToken.IsCancellationRequested);


            // make altitude adjustment if needed
            var altitudeChanged = false;
            do
            {
                var altitudeDifference = currentSteerPoint.Altitude - _sensorSystem.GetAltitude();
                if (altitudeDifference > 1)
                {
                    await _actuatorSystem.MoveUp();
                    altitudeChanged = true;
                }
                else if (altitudeDifference < -1)
                {
                    await _actuatorSystem.MoveDown();
                    altitudeChanged = true;
                }
            } while (Math.Abs(currentSteerPoint.Altitude - _sensorSystem.GetAltitude()) > 1 && !cancellationToken.IsCancellationRequested);


            // Move towards the current steer point if needed
            // var positionChanged = false;
            // var distance = CoordinateUtils.CalculateDistance(_sensorSystem.GetLatitude(), _sensorSystem.GetLongitude(), currentSteerPoint.Latitude, currentSteerPoint.Longitude);
            // if (distance > 1)
            // {
            //     await _actuatorSystem.MoveForward();
            //     positionChanged = true;
            // }

            // circling
            var distance = CoordinateUtils.CalculateDistance(_sensorSystem.GetLatitude(), _sensorSystem.GetLongitude(), currentSteerPoint.Latitude, currentSteerPoint.Longitude);
            if (distance < 500 && isOrderTypeObserve && !isCircling)
            {
                isCircling = true;
                System.Console.WriteLine("\n\n\n CIRCLE TURNED ON \n\n\n");
            }

            if (distance > 1 && !isCircling)
            {
                await _actuatorSystem.MoveForward();
            }

            if (isCircling)
            {
                await _actuatorSystem.MoveForward();

                circleCount++;
                if (circleCount >= 360)
                {
                    isCirclingCompleted = true;
                    isCircling = false;
                    circleCount = 0;
                    System.Console.WriteLine("\n\n\n CIRCLE COMPLETED \n\n\n");
                    await ChangeSteerPoint();
                }
            }
            else if (distance <= 10)
            {
                _logger.LogInformation("Reached steer point {SteerPointIndex}.", _currentSteerPointIndex);
                await ChangeSteerPoint();
            }

            // Update the agent's state based on the sensor readings
            var latitude = _sensorSystem.GetLatitude();
            var longitude = _sensorSystem.GetLongitude();
            var altitude = _sensorSystem.GetAltitude();
            var heading = _sensorSystem.GetHeading();
            var speed = _sensorSystem.GetSpeed();
            _selfAgent.UpdateState(latitude, longitude, altitude, heading, speed);


            return true;
        }

    }
}
