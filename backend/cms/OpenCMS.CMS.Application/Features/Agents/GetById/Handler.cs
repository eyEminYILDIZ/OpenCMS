namespace OpenCMS.CMS.Application.Agents.GetById;

public class Handler : IRequestHandler<Query, Agent?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Agent?> Handle(Query request, CancellationToken cancellationToken)
    {
        var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
        return agent;
    }
}
