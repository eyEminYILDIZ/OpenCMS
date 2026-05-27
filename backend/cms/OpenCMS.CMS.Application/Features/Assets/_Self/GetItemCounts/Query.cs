namespace OpenCMS.CMS.Application.Assets.Self.GetItemCounts;

public class Query : IRequest<Result<QueryResponse>>
{
}

public class QueryResponse
{
    public int ActiveCount { get; set; }
    public int InactiveCount { get; set; }
}
