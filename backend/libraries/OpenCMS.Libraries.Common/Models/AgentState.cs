using OpenCMS.Libraries.Common.Contracts;

namespace OpenCMS.Libraries.Common.Models;

public class AircraftState
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    /// <summary>
    /// Altitude: Metres above mean sea level (AMSL)
    /// </summary>
    public double Altitude { get; set; }

    /// <summary>
    /// Heading: Degrees, relative to true north
    /// </summary>
    public double Heading { get; set; }

    /// <summary>
    /// Ground Speed: Metres per Second (GS)
    /// </summary>
    public double GroundSpeed { get; set; }

    /// <summary>
    /// Airspeed: Indicated Airspeed (IAS) in metres per second
    /// </summary>
    public double AirSpeed { get; set; }

    /// <summary>
    /// Pitch: Degrees, relative to the horizon
    /// </summary>
    public double PitchDeg { get; set; } = 0;

    /// <summary>
    /// Roll: Degrees, relative to the horizon
    /// </summary>
    public double RollDeg { get; set; } = 0;

    /// <summary>
    /// Turn Rate: Degree per Second
    /// </summary>
    public double TurnRate { get; set; } = 0;

    /// <summary>
    /// Vertical Speed: Metres per Second, positive upwards
    /// </summary>
    public double VerticalSpeed { get; set; } = 0;
}

public class AgentState : AircraftState
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public AssetTypesContract AssetType { get; set; }
    public ThreatTypesContract ThreatType { get; set; }
    public Guid? RelatedAgentId { get; set; }
    public double FuelPercentage { get; set; }

    public AgentState()
    {
        Name = "";
        GroundSpeed = 1;
        AirSpeed = 1;
        FuelPercentage = 100.0;
    }

    public AgentState(Guid agentId, Guid assetId, string name, AssetTypesContract assetType, ThreatTypesContract threatType)
    {
        Id = assetId;
        RelatedAgentId = agentId;
        Name = name;
        Latitude = 0;
        Longitude = 0;
        Altitude = 0;
        Heading = 0;
        GroundSpeed = 0;
        AssetType = assetType;
        ThreatType = threatType;
        FuelPercentage = 100.0;
    }

    public void UpdateState(double latitude, double longitude, double altitude, double heading, double speed)
    {
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Heading = heading;
        GroundSpeed = speed;
        AirSpeed = speed;
    }

    public Guid GetAssetId()
    {
        return Id;
    }

    public Guid GetAgentId()
    {
        return RelatedAgentId ?? Guid.Empty;
    }

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Fuel Management //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    public double ConsumeFuel(double amount)
    {
        if (amount < 0)
        {
            throw new ArgumentException("Fuel consumption amount cannot be negative.");
        }

        FuelPercentage -= amount;
        if (FuelPercentage < 0)
        {
            FuelPercentage = 0;
        }
        return FuelPercentage;
    }
}