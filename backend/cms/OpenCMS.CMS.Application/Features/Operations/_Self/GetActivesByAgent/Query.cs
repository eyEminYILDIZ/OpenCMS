namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Query : IRequest<IEnumerable<OperationContract>>
{
    public Guid AgentId { get; set; }
}
