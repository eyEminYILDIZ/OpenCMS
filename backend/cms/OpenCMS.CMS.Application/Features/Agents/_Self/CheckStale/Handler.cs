namespace OpenCMS.CMS.Application.Agents.Self.CheckStale;

public class Handler : INotificationHandler<Notification>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(Notification notification, CancellationToken cancellationToken)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-1);

        var staleAgents = await _dbContext.Agents
            .Where(a => a.IsActive && a.LastSeen < cutoff)
            .ToListAsync(cancellationToken);

        foreach (var agent in staleAgents)
        {
            agent.IsActive = false;
            _dbContext.Agents.Update(agent);
            System.Console.WriteLine("Marked agent {0} as stale", agent.Id);
        }

        if (staleAgents.Count > 0)
            await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
