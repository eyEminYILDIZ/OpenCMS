using OpenCMS.Agent.AirRadar.Models;

namespace OpenCMS.Agent.AirRadar;

public class Radar
{
    private List<Aircraft> _aircrafts;
    public Radar()
    {
        _aircrafts = new List<Aircraft>
        {
            new Aircraft
            {
                Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25"),
                Callsign = "ISO9986",
                Longitude = 48.4194,
                Latitude = 37.7749,
                Altitude = 11000,
                Speed = 450,
                Heading = 90
            },
        };
    }

    private void RandomizeMoveAircrafts()
    {
        var random = new Random();
        foreach (var aircraft in _aircrafts)
        {
            var changeLocation = random.Next() % 2 == 0;
            if (changeLocation)
            {
                aircraft.Longitude += (random.NextDouble() - 0.5) * 0.1;
                aircraft.Latitude += (random.NextDouble() - 0.5) * 0.1;
            }
            var changeAltitude = random.Next() % 2 == 0;
            if (changeAltitude)
            {
                aircraft.Altitude += (random.NextDouble() - 0.5) * 1000;
            }
            var changeSpeed = random.Next() % 2 == 0;
            if (changeSpeed)
            {
                aircraft.Speed += (random.NextDouble() - 0.5) * 20;
            }
            var changeHeading = random.Next() % 2 == 0;
            if (changeHeading)
            {
                aircraft.Heading += (random.NextDouble() - 0.5) * 10;
            }
        }
    }

    internal async Task<List<Aircraft>> Scan()
    {
        // Simulate scanning for aircraft
        await Task.Delay(1000);

        RandomizeMoveAircrafts();

        return _aircrafts;
    }
}