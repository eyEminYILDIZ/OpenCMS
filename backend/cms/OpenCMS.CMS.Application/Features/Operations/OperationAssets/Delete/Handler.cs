namespace OpenCMS.CMS.Application.Operations.OperationAssets.Delete;

public class Handler : IRequestHandler<Command, OperationAsset?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OperationAsset?> Handle(Command request, CancellationToken cancellationToken)
    {
        var operationAsset = await _dbContext.OperationAssets.FirstOrDefaultAsync(oa => oa.Id == request.Id, cancellationToken);

        if (operationAsset == null)
            return null;

        _dbContext.OperationAssets.Remove(operationAsset);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return operationAsset;
    }
}
