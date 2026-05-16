namespace OpenCMS.CMS.Application.Agents.Self.Ping;

public class Handler : IRequestHandler<Command, CommandResponse?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse?> Handle(Command request, CancellationToken cancellationToken)
    {
        var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (agent == null)
            return null;

        agent.LastSeen = DateTime.UtcNow;
        agent.IsActive = true;
        _dbContext.Agents.Update(agent);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommandResponse
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
