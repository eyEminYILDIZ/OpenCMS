namespace OpenCMS.CMS.Application.Operations.Self.Delete;

public class Handler : IRequestHandler<Command, Operation?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Operation?> Handle(Command request, CancellationToken cancellationToken)
    {
        var operation = await _dbContext.Operations.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (operation == null)
            return null;

        _dbContext.Operations.Remove(operation);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return operation;
    }
}
