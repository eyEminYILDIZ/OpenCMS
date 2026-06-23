namespace OpenCMS.CMS.Application.Operations.Orders.Create;

public class Command : IRequest<Result<CommandResponse>>
{
    public Guid OperationId { get; set; }
    public string Description { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime CompletedDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public OrderTypes OrderType { get; set; }
    public DateTime TargetDatePeriodStart { get; set; }
    public DateTime TargetDatePeriodEnd { get; set; }
    public double TargetPointLatitude { get; set; }
    public double TargetPointLongitude { get; set; }
    public double TargetPointAltitude { get; set; }
    public double TargetPointHeading { get; set; }
    public double TargetPointSpeed { get; set; }
    public Guid ResponsibleOperationAssetId { get; set; }
    public Guid? NextOrderId { get; set; }
    public Guid? PreviousOrderId { get; set; }
}

public class CommandResponse
{
    public Guid Id { get; set; }
    public Guid OperationId { get; set; }
    public string Description { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime CompletedDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public OrderTypes OrderType { get; set; }
    public DateTime TargetDatePeriodStart { get; set; }
    public DateTime TargetDatePeriodEnd { get; set; }
    public double TargetPointLatitude { get; set; }
    public double TargetPointLongitude { get; set; }
    public double TargetPointAltitude { get; set; }
    public double TargetPointHeading { get; set; }
    public double TargetPointSpeed { get; set; }
    public Guid ResponsibleOperationAssetId { get; set; }
    public Guid? NextOrderId { get; set; }
    public Guid? PreviousOrderId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
