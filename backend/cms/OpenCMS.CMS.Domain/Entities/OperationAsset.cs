namespace OpenCMS.CMS.Domain.Entities;

public class OperationAsset
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; }

    public Guid OperationId { get; set; }
    public Operation Operation { get; set; }
}