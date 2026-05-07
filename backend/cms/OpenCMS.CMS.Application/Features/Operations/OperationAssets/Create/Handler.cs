namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Handler : IRequestHandler<Command, OperationAsset>
{
    private readonly IApplicationDbContext _context;

    public Handler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationAsset> Handle(Command request, CancellationToken cancellationToken)
    {
        var operationAsset = new OperationAsset
        {
            OperationId = request.OperationId,
            AssetId = request.AssetId
        };

        _context.OperationAssets.Add(operationAsset);
        await _context.SaveChangesAsync(cancellationToken);

        return operationAsset;
    }
}