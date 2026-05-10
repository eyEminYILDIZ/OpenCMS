namespace OpenCMS.Agent.AirRadar.Models;

partial class Aircraft
{
    public Guid Id { get; set; }
    public string Callsign { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public double Altitude { get; set; }
    public double Speed { get; set; }
    public double Heading { get; set; }
}