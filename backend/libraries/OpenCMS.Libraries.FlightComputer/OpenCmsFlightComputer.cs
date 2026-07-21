using OpenCMS.Libraries.FlightComputer.Constants;
using static OpenCMS.Libraries.FlightComputer.Constants.NavigationConstants;

namespace OpenCMS.Libraries.FlightComputer;

public class OpenCmsFlightComputer
{
    // Guards _waypoints and _currentSteerPointIndex, which are written by the autopilot's
    // background Work loop and read by the display's separate rendering loop.
    private readonly Lock _syncLock = new();

    public AgentState _selfAgent { get; private set; }
    private List<Waypoint> _waypoints;
    private int _currentSteerPointIndex = 0;
    private Waypoint _homeWayPoint;

    public OpenCmsFlightComputer(AgentState selfAgent)
    {
        _selfAgent = selfAgent;
        _waypoints = new List<Waypoint>();
    }

    public void SetWayPoints(List<Waypoint> wayPoints)
    {
        lock (_syncLock)
        {
            _waypoints = wayPoints;
        }
    }

    public int GetActiveWaypointIndex()
    {
        lock (_syncLock)
        {
            return _currentSteerPointIndex;
        }
    }

    /// <summary>
    /// Atomically captures cloned waypoints together with the active index that applies to
    /// them, so a reader never sees a list/index pairing that were computed against different
    /// autopilot generations (e.g. an index already advanced past a waypoint whose fields
    /// haven't been recalculated yet).
    /// </summary>
    public (List<Waypoint> Waypoints, int ActiveIndex) GetRenderSnapshot()
    {
        lock (_syncLock)
        {
            var clonedWaypoints = _waypoints.Select(w => w.Clone()).ToList();
            return (clonedWaypoints, _currentSteerPointIndex);
        }
    }

    // Steer point related works
    public async Task ChangeSteerPoint()
    {
        lock (_syncLock)
        {
            if (_waypoints.Count == 0)
            {
                // _logger.LogWarning("No steer points available.");
                return;
            }

            if (_currentSteerPointIndex == -1)
            {
                _currentSteerPointIndex = -2;
                return;
            }

            if (_waypoints.Count == _currentSteerPointIndex + 1)
            {
                // _logger.LogInformation("No more steer points available. Returning to home position.");
                _currentSteerPointIndex = -1;
                return;
            }

            _currentSteerPointIndex++;
        }
    }

    public Waypoint GetCurrentSteerPoint()
    {
        lock (_syncLock)
        {
            if (_currentSteerPointIndex == -1)
            {
                return _homeWayPoint;
            }

            if (_currentSteerPointIndex == -2)
            {
                return null;
            }

            if (_waypoints.Count == 0 || _currentSteerPointIndex >= _waypoints.Count)
            {
                // _logger.LogWarning("No steer points available.");
                return null;
            }

            return _waypoints[_currentSteerPointIndex];
        }
    }

    public void SetHomeWayPoint()
    {
        _homeWayPoint = new Waypoint("Home Waypoint", _selfAgent.Latitude, _selfAgent.Longitude, _selfAgent.Altitude, _selfAgent.Heading, _selfAgent.GroundSpeed, OrderTypesContract.Move);
        System.Console.WriteLine("Home waypoint set");
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////

    public double GetBearingToCurrentSteerPoint()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return 0.0;
        }

        var aircraftState = _selfAgent.CreateSnapshot();
        return CoordinateCalculator.CalculateHeading(aircraftState.Latitude, aircraftState.Longitude, currentSteerPoint.Latitude, currentSteerPoint.Longitude);
    }

    public double GetDistanceToCurrentSteerPoint()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return 0.0;
        }

        var aircraftState = _selfAgent.CreateSnapshot();
        return CoordinateCalculator.CalculateDistance(aircraftState.Latitude, aircraftState.Longitude, currentSteerPoint.Latitude, currentSteerPoint.Longitude);
    }


    public double GetAltitudeDifferenceToCurrentSteerPoint()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return 0.0;
        }

        return currentSteerPoint.Altitude - _selfAgent.CreateSnapshot().Altitude;
    }

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    public void Work()
    {
        if (_selfAgent == null || _waypoints == null || _waypoints.Count == 0)
        {
            throw new InvalidOperationException("Self agent or waypoints are not set.");
        }

        CheckSteerPointArrival();
        CalculateWayPoints();
    }

    public void CheckSteerPointArrival()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return;
        }

        var distanceToSteerPoint = GetDistanceToCurrentSteerPoint();
        if (distanceToSteerPoint <= ComputerConstants.SteerpointProximityRange)
        {
            // _logger.LogInformation($"Arrived at steer point: {currentSteerPoint.Name}");
            _currentSteerPointIndex++;
        }
    }

    public void CalculateWayPoints()
    {
        // Snapshot once so every waypoint in this pass is calculated against the same
        // aircraft position/heading, instead of racing the concurrent AgentState update loop.
        var aircraftState = _selfAgent.CreateSnapshot();

        lock (_syncLock)
        {
            for (int i = 0; i < _waypoints.Count; i++)
            {
                var waypoint = _waypoints[i];

                waypoint.DirectDistance = CoordinateCalculator.CalculateDistance(aircraftState.Latitude, aircraftState.Longitude, waypoint.Latitude, waypoint.Longitude);
                waypoint.DirectBearing = CoordinateCalculator.CalculateHeading(aircraftState.Latitude, aircraftState.Longitude, waypoint.Latitude, waypoint.Longitude);
                waypoint.DirectEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(waypoint.DirectDistance, aircraftState.GroundSpeed);

                if (i > 0)
                {
                    var previousWayPoint = _waypoints[i - 1];
                    waypoint.DistanceToPreviousWayPoint = CoordinateCalculator.CalculateDistance(waypoint.Latitude, waypoint.Longitude, previousWayPoint.Latitude, previousWayPoint.Longitude);
                    waypoint.BearingToPreviousWayPoint = CoordinateCalculator.CalculateHeading(waypoint.Latitude, waypoint.Longitude, previousWayPoint.Latitude, previousWayPoint.Longitude);
                    waypoint.SequentialEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(waypoint.DistanceToPreviousWayPoint, waypoint.Speed);
                }
                else
                {
                    waypoint.DistanceToPreviousWayPoint = 0.0;
                    waypoint.BearingToPreviousWayPoint = 0.0;
                    waypoint.SequentialEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(waypoint.DirectDistance, aircraftState.GroundSpeed);
                }

                double relativeBearing = CoordinateCalculator.AngleDiff(waypoint.DirectBearing, aircraftState.Heading);
                double fraction = Math.Clamp(waypoint.DirectDistance / RangeMeter, 0, 1);
                var (row, col) = CoordinateCalculator.ProjectPoint(relativeBearing, fraction);
                bool inView = Math.Abs(relativeBearing) <= HalfFieldOfViewDeg && waypoint.DirectDistance <= RangeMeter;
                waypoint.DisplayRow = row;
                waypoint.DisplayCol = col;
                waypoint.IsInDisplayView = inView;
            }
        }
    }

    // Speed can be 0 (default/unset agent state) or a negative sentinel (e.g. seeded
    // TargetPointSpeed = -1), which previously produced Infinity/NaN "hours" and blew up
    // TimeSpan.FromHours with an OverflowException. We compute seconds directly instead
    // of round-tripping through TimeSpan, and guard against the non-finite cases.
    private static double CalculateEstimatedTimeOfArrivalSeconds(double distanceMeters, double speed)
    {
        if (speed <= 0 || double.IsNaN(distanceMeters) || double.IsInfinity(distanceMeters))
        {
            return 0;
        }

        var hours = distanceMeters / speed;
        return hours * 3600.0;
    }
}
