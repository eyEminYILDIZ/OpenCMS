namespace OpenCMS.CMS.Application.Agents.Self.Delete;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (agent == null)
            return Error.NotFound;

        _dbContext.Agents.Remove(agent);
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
