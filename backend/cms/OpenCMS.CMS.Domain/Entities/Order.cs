namespace OpenCMS.CMS.Domain.Entities;

public class Order : BaseEntity
{
    public string Description { get; set; }
    public DateTime IssuedDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public OrderTypes OrderType { get; set; }
    public Guid OperationId { get; set; }
    public Operation Operation { get; set; }

    public Guid ResponsibleAssetId { get; set; }
    public OperationAsset ResponsibleAsset { get; set; }

    public Guid? NextOrderId { get; set; }
    public Order NextOrder { get; set; }

    public Guid? PreviousOrderId { get; set; }
    public Order PreviousOrder { get; set; }
}

public enum OrderTypes
{
    Move = 0,
    Attack = 1,
    Defend = 2,
    GatherIntelligence = 3,
}

public enum OrderStatus
{
    Passive = 0,
    Active = 1,
}