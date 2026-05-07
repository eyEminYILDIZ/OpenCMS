namespace OpenCMS.CMS.Application.Agents.Self.Delete;

public class Handler : IRequestHandler<Command, Agent?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Agent?> Handle(Command request, CancellationToken cancellationToken)
    {
        var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (agent == null)
            return null;

        _dbContext.Agents.Remove(agent);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return agent;
    }
}
