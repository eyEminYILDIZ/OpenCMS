namespace OpenCMS.CMS.Application.Operations.OperationAssets.Delete;

public class Command : IRequest<Result<CommandResponse>>
{
    public Guid Id { get; set; }
}

public class CommandResponse
{
    public Guid Id { get; set; }
    public Guid OperationId { get; set; }
    public Guid AssetId { get; set; }
}
