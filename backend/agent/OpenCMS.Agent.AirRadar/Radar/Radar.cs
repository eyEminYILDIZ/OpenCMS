using OpenCMS.Agent.AirRadar.Models;

namespace OpenCMS.Agent.AirRadar;

public class Radar
{
    private const double CircleRadiusKm = 20.0;
    private const double AngleStepDegrees = 2.0;

    private List<Aircraft> _detectedAircrafts;
    private readonly Dictionary<Guid, (double CenterLat, double CenterLon, double AngleDegrees)> _circleState;

    public Radar()
    {
        _detectedAircrafts = new List<Aircraft>
        {
            new Aircraft
            {
                Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25"),
                Callsign = "ISO9986",
                Longitude = 41.4194,
                Latitude = 37.7749,
                Altitude = 11000,
                Speed = 450,
                Heading = 90
            },
        };

        _circleState = _detectedAircrafts.ToDictionary(
            a => a.Id,
            a => (CenterLat: a.Latitude, CenterLon: a.Longitude, AngleDegrees: 0.0)
        );
    }

    private void DrawCircle()
    {
        foreach (var aircraft in _detectedAircrafts)
        {
            var (centerLat, centerLon, angleDegrees) = _circleState[aircraft.Id];

            var angleRad = angleDegrees * Math.PI / 180.0;
            var centerLatRad = centerLat * Math.PI / 180.0;

            // 1 degree latitude ≈ 111.32 km
            var latOffsetDeg = CircleRadiusKm / 111.32 * Math.Cos(angleRad);
            var lonOffsetDeg = CircleRadiusKm / (111.32 * Math.Cos(centerLatRad)) * Math.Sin(angleRad);

            aircraft.Latitude = centerLat + latOffsetDeg;
            aircraft.Longitude = centerLon + lonOffsetDeg;

            // Heading is tangent to the circle (90° ahead of the radial angle)
            aircraft.Heading = (angleDegrees + 90.0) % 360.0;

            var newAngle = (angleDegrees + AngleStepDegrees) % 360.0;
            _circleState[aircraft.Id] = (centerLat, centerLon, newAngle);
        }
    }

    internal async Task<List<Aircraft>> Scan()
    {
        // Simulate scanning for aircraft
        await Task.Delay(1000);

        DrawCircle();

        return _detectedAircrafts;
    }
}