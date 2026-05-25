namespace OpenCMS.CMS.Application.Operations.OperationAssets.Delete;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var operationAsset = await _dbContext.OperationAssets.FirstOrDefaultAsync(oa => oa.Id == request.Id, cancellationToken);

        if (operationAsset == null)
            return Error.NotFound;

        _dbContext.OperationAssets.Remove(operationAsset);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommandResponse
        {
            Id = operationAsset.Id,
            OperationId = operationAsset.OperationId,
            AssetId = operationAsset.AssetId
        };
    }
}
