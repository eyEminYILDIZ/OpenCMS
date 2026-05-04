namespace OpenCMS.CMS.Application.Agents.Create;

public class Command : IRequest<Agent>
{
    public string Name { get; set; }
}

public class Handler : IRequestHandler<Command, Agent>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Agent> Handle(Command request, CancellationToken cancellationToken)
    {
        var agent = new Agent
        {
            Name = request.Name
        };
        _dbContext.Agents.Add(agent);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return agent;
    }
}
