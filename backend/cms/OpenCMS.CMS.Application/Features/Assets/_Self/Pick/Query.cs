namespace OpenCMS.CMS.Application.Assets.Self.Pick;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public string SearchValue { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
