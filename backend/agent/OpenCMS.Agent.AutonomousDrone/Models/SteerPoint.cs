namespace OpenCMS.Agent.AutonomousDrone.Models;

public class SteerPoint
{
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }

    public SteerPoint(string name, double latitude, double longitude, double altitude, double heading, double speed)
    {
        Name = name;
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Heading = heading;
        Speed = speed;
    }
}