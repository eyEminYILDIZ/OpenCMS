namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Command : IRequest<Result<CommandResponse>>
{
    public Guid OperationId { get; set; }
    public Guid AssetId { get; set; }
}

public class CommandResponse
{
    public Guid Id { get; set; }
    public Guid OperationId { get; set; }
    public Guid AssetId { get; set; }
}
