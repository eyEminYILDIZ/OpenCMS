namespace OpenCMS.CMS.Application.Operations.Orders.Pick;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public string SearchValue { get; set; }
    public Guid RelationId { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
