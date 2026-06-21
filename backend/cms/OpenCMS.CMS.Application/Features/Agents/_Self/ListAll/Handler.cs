namespace OpenCMS.CMS.Application.Agents.Self.ListAll;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var agentQuery = _dbContext.Agents.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            agentQuery = agentQuery.Where(a => a.Name.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var agents = await agentQuery.ToListAsync(cancellationToken);

        return agents.Select(agent => new QueryResponse
        {
            Id = agent.Id,
            Name = agent.Name,
            Description = agent.Description,
            AgentType = agent.AgentType,
            LastSeen = agent.LastSeen,
            IsActive = agent.IsActive,
            CreatedAt = agent.CreatedAt,
            UpdatedAt = agent.UpdatedAt
        }).ToList();
    }
}
