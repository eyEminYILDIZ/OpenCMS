namespace OpenCMS.CMS.Application.Agents.Self.Update;

public class Command : IRequest<CommandResponse?>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public AgentTypes AgentType { get; set; }
    public string Description { get; set; }
}

public class CommandResponse
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
