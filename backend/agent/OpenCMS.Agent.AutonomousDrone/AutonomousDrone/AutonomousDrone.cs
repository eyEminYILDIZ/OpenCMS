namespace OpenCMS.Agent.AutonomousDrone;

public class AutonomousDrone : IDisposable
{
    private readonly AgentState _selfAgent;
    private readonly ActuatorSystem _actuatorSystem;
    private readonly SensorSystem _sensorSystem;
    private readonly ILogger<AutonomousDrone> _logger;
    private bool _loggingEnabled = false;

    private readonly OpenCmsFlightComputer _flightComputer;
    private readonly OpenCmsDroneAutoPilot _autoPilot;
    private readonly CancellationToken _cancellationToken;
    private Func<AgentState, Task> agentStateUpdateCallback;


    public AutonomousDrone(AgentState selfAgent, ThreeDimensionWorld world, ILogger<AutonomousDrone> logger, CancellationToken cancellationToken, bool loggingEnabled = false)
    {
        _selfAgent = selfAgent;
        _logger = logger;
        _loggingEnabled = loggingEnabled;
        _actuatorSystem = new ActuatorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _sensorSystem = new SensorSystem(world, selfAgent.GetAssetId(), loggingEnabled);
        _flightComputer = new OpenCmsFlightComputer(_selfAgent);
        _autoPilot = new OpenCmsDroneAutoPilot(_flightComputer, _actuatorSystem, loggingEnabled);
        _cancellationToken = cancellationToken;
    }

    public void Dispose()
    {
        _autoPilot.Stop().Wait();
    }

    public void SetAgentStateUpdateCallback(Func<AgentState, Task> callback)
    {
        agentStateUpdateCallback = callback;
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

        _ = Task.Run(() => UpdateState(_cancellationToken), _cancellationToken);
    }

    // Update state for Autopilot can use updated state of agent
    public async Task UpdateState(CancellationToken cancellationToken)
    {
        var count = 0;
        while (!cancellationToken.IsCancellationRequested)
        {
            // Update the agent's state based on the sensor readings
            var latitude = _sensorSystem.GetLatitude();
            var longitude = _sensorSystem.GetLongitude();
            var altitude = _sensorSystem.GetAltitude();
            var heading = _sensorSystem.GetHeading();
            var speed = _sensorSystem.GetSpeed();
            _selfAgent.UpdateState(latitude, longitude, altitude, heading, speed);

            if (agentStateUpdateCallback! != null && count % 10 == 0) // Update CMS every 10 cycles
            {
                await agentStateUpdateCallback(_selfAgent);
            }

            var delayCount = _autoPilot.IsRunning ? 10 : 100;
            await Task.Delay(delayCount, cancellationToken); // Adjust the delay as needed
            count++;
        }
    }

    public async Task ControlDrone(ActuatorActionTypes actionType, double value = 1.0)
    {
        if (_autoPilot.IsRunning && actionType != ActuatorActionTypes.CloseAutopilot)
        {
            _logger.LogWarning("Cannot control drone manually while autopilot is running. Please stop the autopilot first by pressing 'B' key.");
            return;
        }

        switch (actionType)
        {
            case ActuatorActionTypes.MoveForward:
                await _actuatorSystem.MoveForward(value);
                break;
            case ActuatorActionTypes.MoveBackward:
                await _actuatorSystem.MoveBackward(value);
                break;
            case ActuatorActionTypes.MoveUp:
                await _actuatorSystem.MoveUp(value);
                break;
            case ActuatorActionTypes.MoveDown:
                await _actuatorSystem.MoveDown(value);
                break;
            case ActuatorActionTypes.TurnLeft:
                await _actuatorSystem.TurnLeft(value);
                break;
            case ActuatorActionTypes.TurnRight:
                await _actuatorSystem.TurnRight(value);
                break;
            case ActuatorActionTypes.OpenAutopilot:
                await _autoPilot.Start(_cancellationToken);
                break;
            case ActuatorActionTypes.CloseAutopilot:
                await _autoPilot.Stop();
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(actionType), actionType, null);
        }
    }
}
