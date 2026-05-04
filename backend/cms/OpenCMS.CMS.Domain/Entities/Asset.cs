namespace OpenCMS.CMS.Domain.Entities;

public class Asset : BaseEntity
{
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double SpeedKmh { get; set; }
    public AssetTypes AssetType { get; set; }
    public ThreatTypes ThreatType { get; set; }
    public DateTime FirstUpdated { get; set; }
    public DateTime LastUpdated { get; set; }
    public bool IsActive { get; set; }
}

public enum AssetTypes
{
    Unknown = 0,
    Person = 1,
    GroupOfPeople = 2,
    Aircraft = 3,
    Ship = 4,
    Submarine = 5,
    Vehicle = 6,
    Building = 7,
    Other = 8
}

public enum ThreatTypes
{
    Unknown = 0,
    Own = 1,
    Friend = 2,
    Neutral = 3,
    Hostile = 4
}