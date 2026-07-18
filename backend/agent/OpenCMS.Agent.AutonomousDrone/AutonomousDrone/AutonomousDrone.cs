namespace OpenCMS.Agent.AutonomousDrone;

public class AutonomousDrone
{
    private readonly AgentState _selfAgent;
    private readonly ActuatorSystem _actuatorSystem;
    private readonly SensorSystem _sensorSystem;
    private readonly ILogger<AutonomousDrone> _logger;
    private bool _loggingEnabled = false;

    private readonly OpenCmsFlightComputer _flightComputer;
    private readonly OpenCmsDroneAutoPilot _autoPilot;

    public AutonomousDrone(AgentState selfAgent, ThreeDimensionWorld world, ILogger<AutonomousDrone> logger, bool loggingEnabled = false)
    {
        _selfAgent = selfAgent;
        _logger = logger;
        _loggingEnabled = loggingEnabled;
        _actuatorSystem = new ActuatorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _sensorSystem = new SensorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _flightComputer = new OpenCmsFlightComputer(_selfAgent);
        _autoPilot = new OpenCmsDroneAutoPilot(_flightComputer, _actuatorSystem, loggingEnabled);
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

    public async Task<bool> Work(CancellationToken cancellationToken)
    {
        // autopilot call

        // Update the agent's state based on the sensor readings
        var latitude = _sensorSystem.GetLatitude();
        var longitude = _sensorSystem.GetLongitude();
        var altitude = _sensorSystem.GetAltitude();
        var heading = _sensorSystem.GetHeading();
        var speed = _sensorSystem.GetSpeed();
        _selfAgent.UpdateState(latitude, longitude, altitude, heading, speed);

        return await _autoPilot.Work(cancellationToken);
    }
}
