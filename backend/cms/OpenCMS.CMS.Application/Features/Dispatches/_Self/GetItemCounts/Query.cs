namespace OpenCMS.CMS.Application.Dispatches.Self.GetItemCounts;

public class Query : IRequest<Result<QueryResponse>>
{
}

public class QueryResponse
{
    public int TotalCount { get; set; }
}
