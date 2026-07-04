namespace OpenCMS.CMS.Application.Dispatches.Self.ListAll;

public class Query : IRequest<Result<List<QueryResponse>>>
{
    public string SearchValue { get; set; }
}

public class QueryResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DispatchCategories Category { get; set; }
    public DateTime OccuredAt { get; set; }
    public Guid RelatedEntityId { get; set; }
    public Guid? RelatedChildEntityId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
