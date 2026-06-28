namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

using OpenCMS.CMS.Domain.Entities;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public Guid AgentId { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EstimatedEndDate { get; set; }
    public DateTime? EndDate { get; set; }
    public OperationStatus OperationStatus { get; set; }
    public OperationType OperationType { get; set; }
}

