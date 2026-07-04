namespace OpenCMS.CMS.Application.Dispatches.Self.ListFiltered;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var dispatches = await _dbContext.Dispatches
            .Where(d => d.RelatedEntityId == request.RelatedEntityId)
            .ToListAsync(cancellationToken);

        return dispatches.Select(dispatch => new QueryResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt
        }).ToList();
    }
}
