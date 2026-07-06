namespace OpenCMS.CMS.Application.Dispatches.Self.ListAll;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var dispatchQuery = _dbContext.Dispatches.Include(d => d.ProviderAgent).AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            dispatchQuery = dispatchQuery.Where(d => d.Title.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var dispatches = await dispatchQuery.OrderByDescending(d => d.OccuredAt).ToListAsync(cancellationToken);

        return dispatches.Select(dispatch => new QueryResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            ProviderAgentName = dispatch.ProviderAgent.Name,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt
        }).ToList();
    }
}
