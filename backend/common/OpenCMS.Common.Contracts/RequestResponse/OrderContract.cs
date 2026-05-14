namespace OpenCMS.Common.Contracts.RequestResponse;

public class OrderContract
{
    public Guid Id { get; set; }
    public string Description { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime CompletedDate { get; set; }
    public OrderStatusContract OrderStatus { get; set; }
    public OrderTypesContract OrderType { get; set; }
    public Guid OperationId { get; set; }

    public DateTime TargetDatePeriodStart { get; set; }
    public DateTime TargetDatePeriodEnd { get; set; }

    public double TargetPointLatitude { get; set; }
    public double TargetPointLongitude { get; set; }
    public double TargetPointAltitude { get; set; }
    public double TargetPointHeading { get; set; }
    public double TargetPointSpeedKmh { get; set; }

    public Guid ResponsibleAssetId { get; set; }

    public Guid? NextOrderId { get; set; }
    public OrderContract NextOrder { get; set; }

    public Guid? PreviousOrderId { get; set; }
    public OrderContract PreviousOrder { get; set; }
}

public enum OrderTypesContract
{
    Move = 0,
    Attack = 1,
    Defend = 2,
    GatherIntelligence = 3,
    Exchange = 4,
    Take = 5,
    Give = 6,
}

public enum OrderStatusContract
{
    Passive = 0,
    Active = 1,
}