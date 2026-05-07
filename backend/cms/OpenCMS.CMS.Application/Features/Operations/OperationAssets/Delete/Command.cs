namespace OpenCMS.CMS.Application.Operations.OperationAssets.Delete;

public class Command : IRequest<OperationAsset?>
{
    public Guid Id { get; set; }
}
