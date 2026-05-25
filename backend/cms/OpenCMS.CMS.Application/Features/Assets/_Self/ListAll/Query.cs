namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Query : IRequest<Result<List<QueryResponse>>>
{
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }
    public AssetTypes AssetType { get; set; }
    public ThreatTypes ThreatType { get; set; }
    public bool IsActive { get; set; }
    public DateTime FirstUpdated { get; set; }
    public DateTime LastUpdated { get; set; }
    public Guid? RelatedAgentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
