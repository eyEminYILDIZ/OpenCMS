using OpenCMS.Libraries.Common.Contracts;
using OpenCMS.Libraries.Common.Models;
using OpenCMS.Libraries.FlightComputer.Calculators;

namespace OpenCMS.Libraries.FlightComputer;

public class OpenCmsFlightComputer
{
    private AgentState _selfAgent;
    private List<WayPoint> _steerPoints;
    private int _currentSteerPointIndex = 0;
    private WayPoint _homeSteerPoint;

    public OpenCmsFlightComputer()
    {
        _steerPoints = new List<WayPoint>();
    }

    public void SetSteerPoints(List<WayPoint> steerPoints)
    {
        _steerPoints = steerPoints;
    }

    // Steer point related works
    public async Task ChangeSteerPoint()
    {
        if (_steerPoints.Count == 0)
        {
            // _logger.LogWarning("No steer points available.");
            return;
        }

        if (_currentSteerPointIndex == -1)
        {
            _currentSteerPointIndex = -2;
            return;
        }

        if (_steerPoints.Count == _currentSteerPointIndex + 1)
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
            return _homeSteerPoint;
        }

        if (_currentSteerPointIndex == -2)
        {
            return null;
        }

        if (_steerPoints.Count == 0 || _currentSteerPointIndex >= _steerPoints.Count)
        {
            // _logger.LogWarning("No steer points available.");
            return null;
        }

        return _steerPoints[_currentSteerPointIndex];
    }

    public void SetHomeWayPoint()
    {
        _homeSteerPoint = new WayPoint("Home Waypoint", _selfAgent.Latitude, _selfAgent.Longitude, _selfAgent.Altitude, _selfAgent.Heading, _selfAgent.Speed, OrderTypesContract.Move);
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
}
