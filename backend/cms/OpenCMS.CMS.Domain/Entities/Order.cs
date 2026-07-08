namespace OpenCMS.CMS.Domain.Entities;

public class Order : BaseEntity
{
    public string Code { get; set; }
    public string Description { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime CompletedDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public OrderTypes OrderType { get; set; }
    public Guid OperationId { get; set; }
    public Operation Operation { get; set; }


    public DateTime TargetDatePeriodStart { get; set; }
    public DateTime TargetDatePeriodEnd { get; set; }

    public double TargetPointLatitude { get; set; }
    public double TargetPointLongitude { get; set; }
    public double TargetPointAltitude { get; set; }
    public double TargetPointHeading { get; set; }
    public double TargetPointSpeed { get; set; }

    public Guid ResponsibleOperationAssetId { get; set; }
    public OperationAsset ResponsibleOperationAsset { get; set; }

    public Guid? TargetOperationAssetId { get; set; }
    public OperationAsset TargetOperationAsset { get; set; }

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
    Exchange = 4,
    Take = 5,
    Give = 6,
}

public enum OrderStatus
{
    NotStarted = 0,
    Started = 1,
    Completed = 2,
    Cancelled = 3,
    Failed = 4,
    Unknown = 5,
}