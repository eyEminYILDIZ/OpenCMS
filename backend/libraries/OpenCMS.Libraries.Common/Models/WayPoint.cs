using OpenCMS.Libraries.Common.Contracts;

namespace OpenCMS.Libraries.Common.Models;

public class WayPoint
{
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }
    public OrderTypesContract OrderType { get; set; }

    public WayPoint(string name, double latitude, double longitude, double altitude, double heading, double speed, OrderTypesContract orderType)
    {
        Name = name;
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Heading = heading;
        Speed = speed;
        OrderType = orderType;
    }
}