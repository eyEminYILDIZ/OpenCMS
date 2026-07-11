namespace OpenCMS.Agent.AutonomousDrone.Models;

public class SteerPoint
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }

    public SteerPoint(double latitude, double longitude, double altitude, double heading, double speed)
    {
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Heading = heading;
        Speed = speed;
    }
}