
namespace OpenCMS.Libraries.FlightComputer;

public class OpenCmsFlightComputer
{
    public AgentState _selfAgent { get; private set; }
    private List<WayPoint> _waypoints;
    private int _currentSteerPointIndex = 0;
    private WayPoint _homeWayPoint;

    public OpenCmsFlightComputer(AgentState selfAgent)
    {
        _selfAgent = selfAgent;
        _waypoints = new List<WayPoint>();
    }

    public void SetWayPoints(List<WayPoint> wayPoints)
    {
        _waypoints = wayPoints;
    }

    // Steer point related works
    public async Task ChangeSteerPoint()
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

    public WayPoint GetCurrentSteerPoint()
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

    public void SetHomeWayPoint()
    {
        _homeWayPoint = new WayPoint("Home Waypoint", _selfAgent.Latitude, _selfAgent.Longitude, _selfAgent.Altitude, _selfAgent.Heading, _selfAgent.Speed, OrderTypesContract.Move);
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

        return CoordinateCalculator.CalculateHeading(_selfAgent.Latitude, _selfAgent.Longitude, currentSteerPoint.Latitude, currentSteerPoint.Longitude);
    }

    public double GetDistanceToCurrentSteerPoint()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return 0.0;
        }

        return CoordinateCalculator.CalculateDistance(_selfAgent.Latitude, _selfAgent.Longitude, currentSteerPoint.Latitude, currentSteerPoint.Longitude);
    }


    public double GetAltitudeDifferenceToCurrentSteerPoint()
    {
        var currentSteerPoint = GetCurrentSteerPoint();
        if (currentSteerPoint == null)
        {
            return 0.0;
        }

        return currentSteerPoint.Altitude - _selfAgent.Altitude;
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

        CalculateWayPoints();
    }

    public void CalculateWayPoints()
    {
        for (int i = 0; i < _waypoints.Count; i++)
        {
            var wayPoint = _waypoints[i];

            wayPoint.DirectDistance = CoordinateCalculator.CalculateDistance(_selfAgent.Latitude, _selfAgent.Longitude, wayPoint.Latitude, wayPoint.Longitude);
            wayPoint.DirectBearing = CoordinateCalculator.CalculateHeading(_selfAgent.Latitude, _selfAgent.Longitude, wayPoint.Latitude, wayPoint.Longitude);
            wayPoint.DirectEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(wayPoint.DirectDistance, _selfAgent.Speed);

            if (i > 0)
            {
                var previousWayPoint = _waypoints[i - 1];
                wayPoint.DistanceToPreviousWayPoint = CoordinateCalculator.CalculateDistance(wayPoint.Latitude, wayPoint.Longitude, previousWayPoint.Latitude, previousWayPoint.Longitude);
                wayPoint.BearingToPreviousWayPoint = CoordinateCalculator.CalculateHeading(wayPoint.Latitude, wayPoint.Longitude, previousWayPoint.Latitude, previousWayPoint.Longitude);
                wayPoint.SequentialEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(wayPoint.DistanceToPreviousWayPoint, wayPoint.Speed);
            }
            else
            {
                wayPoint.DistanceToPreviousWayPoint = 0.0;
                wayPoint.BearingToPreviousWayPoint = 0.0;
                wayPoint.SequentialEstimatedTimeOfArrival = CalculateEstimatedTimeOfArrivalSeconds(wayPoint.DirectDistance, _selfAgent.Speed);
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
