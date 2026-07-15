using OpenCMS.Agent.AirRadar.Models;

namespace OpenCMS.Agent.AirRadar;

public class Radar
{
    private const double CircleRadiusKm = 5.0;
    private const double AngleStepDegrees = 1.0;

    private List<Aircraft> _detectedAircrafts;
    private readonly Dictionary<Guid, (double CenterLat, double CenterLon, double AngleDegrees)> _circleState;

    public Radar()
    {
        const double centerLat = 41.0211240853284;
        const double centerLon = 29.0041058259891;
        var aircraftId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25");

        _circleState = new()
        {
            [aircraftId] = (centerLat, centerLon, 0.0),
        };

        _detectedAircrafts = new List<Aircraft>
        {
            new Aircraft
            {
                Id = aircraftId,
                Callsign = "Hostile Aircraft - 11354",
                Latitude = centerLat + CircleRadiusKm / 111.32, // start at northernmost point of circle
                Longitude = centerLon,
                Altitude = 11000,
                Speed = 450,
                Heading = 90.0, // heading East at angle=0 (clockwise tangent)
            },
        };
    }

    private void DrawCircle()
    {
        foreach (var aircraft in _detectedAircrafts)
        {
            var (centerLat, centerLon, angleDegrees) = _circleState[aircraft.Id];

            var angleRad = angleDegrees * Math.PI / 180.0;
            var centerLatRad = centerLat * Math.PI / 180.0;

            aircraft.Latitude = centerLat + CircleRadiusKm / 111.32 * Math.Cos(angleRad);
            aircraft.Longitude = centerLon + CircleRadiusKm / (111.32 * Math.Cos(centerLatRad)) * Math.Sin(angleRad);

            // Tangent direction for clockwise motion: 90° ahead of radial angle
            aircraft.Heading = (angleDegrees + 90.0) % 360.0;

            _circleState[aircraft.Id] = (centerLat, centerLon, (angleDegrees + AngleStepDegrees) % 360.0);
        }
    }

    internal async Task<List<Aircraft>> Scan()
    {
        // Simulate scanning for aircraft
        await Task.Delay(500);

        DrawCircle();

        return _detectedAircrafts;
    }
}
