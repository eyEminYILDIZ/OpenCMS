namespace OpenCMS.CMS.Application.Agents.ListAll;

public class Query : IRequest<IEnumerable<Agent>>
{
}

public class Handler : IRequestHandler<Query, IEnumerable<Agent>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Agent>> Handle(Query request, CancellationToken cancellationToken)
    {
        var agents = await _dbContext.Agents.ToListAsync(cancellationToken);
        return agents;
    }
}
