namespace OpenCMS.CMS.Application.Agents.Self.Update;

public class Command : IRequest<Agent?>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public AgentTypes AgentType { get; set; }
}
