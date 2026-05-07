namespace OpenCMS.CMS.Application.Assets.Self.Update;

public class Command : IRequest<Asset?>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double SpeedKmh { get; set; }
    public AssetTypes AssetType { get; set; }
    public ThreatTypes ThreatType { get; set; }
    public bool IsActive { get; set; }
}
