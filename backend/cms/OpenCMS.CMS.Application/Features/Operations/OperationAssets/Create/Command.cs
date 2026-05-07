namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Command : IRequest<OperationAsset>
{
    public Guid OperationId { get; set; }
    public Guid AssetId { get; set; }
}