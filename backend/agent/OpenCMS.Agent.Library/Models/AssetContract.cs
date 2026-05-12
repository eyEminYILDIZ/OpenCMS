namespace OpenCMS.Agent.Library.Models;

public class AssetContract
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }
    public int AssetType { get; set; }
    public int ThreatType { get; set; }
}