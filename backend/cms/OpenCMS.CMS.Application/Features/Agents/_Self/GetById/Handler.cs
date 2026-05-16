namespace OpenCMS.CMS.Application.Agents.Self.GetById;

public class Handler : IRequestHandler<Query, QueryResponse?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<QueryResponse?> Handle(Query request, CancellationToken cancellationToken)
    {
        var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (agent == null)
            return null;

        return new QueryResponse
        {
            Id = agent.Id,
            Name = agent.Name,
            Description = agent.Description,
            AgentType = agent.AgentType,
            LastSeen = agent.LastSeen,
            IsActive = agent.IsActive,
            CreatedAt = agent.CreatedAt,
            UpdatedAt = agent.UpdatedAt
        };
    }
}
