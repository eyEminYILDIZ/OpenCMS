namespace OpenCMS.CMS.Application.Operations.Self.ListAll;

public class Handler : IRequestHandler<Query, IEnumerable<Operation>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Operation>> Handle(Query request, CancellationToken cancellationToken)
    {
        var operations = await _dbContext.Operations.ToListAsync(cancellationToken);
        return operations;
    }
}
