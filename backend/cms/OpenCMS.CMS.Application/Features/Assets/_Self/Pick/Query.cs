namespace OpenCMS.CMS.Application.Assets.Self.Pick;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public string SearchValue { get; set; }
    // For every pick endpoint, request model must be the same
    // so send relation id as empty guid for this.
    public Guid RelationId { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
