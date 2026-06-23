namespace OpenCMS.CMS.Application.Operations.OperationAssets.Pick;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public Guid RelationId { get; set; }
    public string SearchValue { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
