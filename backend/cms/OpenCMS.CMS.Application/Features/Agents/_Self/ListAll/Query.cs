namespace OpenCMS.CMS.Application.Agents.Self.ListAll;

public class Query : IRequest<IEnumerable<QueryResponse>>
{
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public AgentTypes AgentType { get; set; }
    public DateTime LastSeen { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
