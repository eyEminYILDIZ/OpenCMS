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
    public AssetTypesContract AssetType { get; set; }
    public ThreatTypesContract ThreatType { get; set; }
}


public enum AssetTypesContract
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

public enum ThreatTypesContract
{
    Unknown = 0,
    Own = 1,
    Friend = 2,
    Neutral = 3,
    Hostile = 4
}