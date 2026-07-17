using OpenCMS.Libraries.Common.Contracts;

namespace OpenCMS.Libraries.Common.Models;

public class AgentState
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
    public Guid? RelatedAgentId { get; set; }
    public double _fuelPercentage;

    public AgentState()
    {

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
        Speed = 0;
        AssetType = assetType;
        ThreatType = threatType;
        _fuelPercentage = 100.0;
    }

    public void UpdateState(double latitude, double longitude, double altitude, double heading, double speed)
    {
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Heading = heading;
        Speed = speed;
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

    public double GetFuelPercentage()
    {
        return _fuelPercentage;
    }

    public double ConsumeFuel(double amount)
    {
        if (amount < 0)
        {
            throw new ArgumentException("Fuel consumption amount cannot be negative.");
        }

        _fuelPercentage -= amount;
        if (_fuelPercentage < 0)
        {
            _fuelPercentage = 0;
        }
        return _fuelPercentage;
    }
}