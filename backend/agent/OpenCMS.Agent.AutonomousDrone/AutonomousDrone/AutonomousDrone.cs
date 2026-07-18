namespace OpenCMS.Agent.AutonomousDrone;

public class AutonomousDrone
{
    private readonly AgentState _selfAgent;
    private readonly ActuatorSystem _actuatorSystem;
    private readonly SensorSystem _sensorSystem;
    private readonly ILogger<AutonomousDrone> _logger;
    private bool _loggingEnabled = false;

    private readonly OpenCmsFlightComputer _flightComputer;

    public AutonomousDrone(AgentState selfAgent, ThreeDimensionWorld world, ILogger<AutonomousDrone> logger, bool loggingEnabled = false)
    {
        _selfAgent = selfAgent;
        _logger = logger;
        _loggingEnabled = loggingEnabled;
        _actuatorSystem = new ActuatorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _sensorSystem = new SensorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _flightComputer = new OpenCmsFlightComputer();
    }

    public void SetWayPoints(List<WayPoint> wayPoints)
    {
        _flightComputer.SetWayPoints(wayPoints);
    }




    public async Task Start()
    {
        // save home position
        var latitude = _sensorSystem.GetLatitude();
        var longitude = _sensorSystem.GetLongitude();
        var altitude = _sensorSystem.GetAltitude();
        var heading = _sensorSystem.GetHeading();
        var speed = _sensorSystem.GetSpeed();

        _selfAgent.UpdateState(latitude, longitude, altitude, heading, speed);
        _flightComputer.SetHomeWayPoint();
    }


    bool isCirclingCompleted = false;
    bool isCircling = false;
    bool isOrderTypeObserve = false;// currentSteerPoint.OrderType == OrderTypes.Observe;
    int circleCount = 0;

    public async Task<bool> Work(CancellationToken cancellationToken)
    {
        var currentSteerPoint = _flightComputer.GetCurrentSteerPoint();
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

        isOrderTypeObserve = currentSteerPoint.OrderType == OrderTypesContract.Observe;
        var headingChanged = false;
        var bearing = 0.0;

        // make turn if needed
        bearing = _flightComputer.GetBearingToCurrentSteerPoint();

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
            var altitudeDifference = _flightComputer.GetAltitudeDifferenceToCurrentSteerPoint();
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
        } while (Math.Abs(_flightComputer.GetAltitudeDifferenceToCurrentSteerPoint()) > 1 && !cancellationToken.IsCancellationRequested);


        // Move towards the current steer point if needed
        // var positionChanged = false;
        // var distance = _flightComputer.GetDistanceToCurrentSteerPoint();
        // if (distance > 1)
        // {
        //     await _actuatorSystem.MoveForward();
        //     positionChanged = true;
        // }

        // circling
        var distance = _flightComputer.GetDistanceToCurrentSteerPoint();
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
                await _flightComputer.ChangeSteerPoint();
            }
        }
        else if (distance <= 10)
        {
            _logger.LogInformation("Reached steer point.");
            await _flightComputer.ChangeSteerPoint();
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
