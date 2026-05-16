namespace OpenCMS.CMS.Application.Agents.Self.Create;

public class Handler : IRequestHandler<Command, CommandResponse>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse> Handle(Command request, CancellationToken cancellationToken)
    {
        var agent = new Agent
        {
            Name = request.Name,
            AgentType = request.AgentType,
            Description = request.Description
        };
        _dbContext.Agents.Add(agent);
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
