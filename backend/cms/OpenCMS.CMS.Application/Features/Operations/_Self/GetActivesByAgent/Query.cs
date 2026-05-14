namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Query : IRequest<IEnumerable<Operation>>
{
    public Guid AgentId { get; set; }
}
