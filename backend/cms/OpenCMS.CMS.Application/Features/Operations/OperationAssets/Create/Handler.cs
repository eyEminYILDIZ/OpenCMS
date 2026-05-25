namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _context;

    public Handler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var operationAsset = new OperationAsset
        {
            OperationId = request.OperationId,
            AssetId = request.AssetId
        };

        _context.OperationAssets.Add(operationAsset);
        await _context.SaveChangesAsync(cancellationToken);

        return new CommandResponse
        {
            Id = operationAsset.Id,
            OperationId = operationAsset.OperationId,
            AssetId = operationAsset.AssetId
        };
    }
}
