namespace OpenCMS.CMS.Application.Operations.Self.GetById;

using OpenCMS.CMS.Domain.Entities;

public class ResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EstimatedEndDate { get; set; }
    public DateTime? EndDate { get; set; }
    public OperationStatus OperationStatus { get; set; }
    public OperationType OperationType { get; set; }
    public List<OrderResponse> Orders { get; set; } = [];
    public List<OperationAssetResponse> OperationAssets { get; set; } = [];
    public List<DispatchResponse> Dispatches { get; set; } = [];
}

public class OrderResponse
{
    public Guid Id { get; set; }
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
    public Guid? TargetOperationAssetId { get; set; }
    public Guid? NextOrderId { get; set; }
    public Guid? PreviousOrderId { get; set; }
}

public class OperationAssetResponse
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public AssetResponse Asset { get; set; }
}

public class DispatchResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DispatchCategories Category { get; set; }
    public DateTime OccuredAt { get; set; }
    public Guid RelatedEntityId { get; set; }
    public Guid? RelatedChildEntityId { get; set; }
    public Guid ProviderAgentId { get; set; }
    public string ProviderAgentName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class AssetResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Speed { get; set; }
    public AssetTypes AssetType { get; set; }
    public ThreatTypes ThreatType { get; set; }
    public DateTime FirstUpdated { get; set; }
    public DateTime LastUpdated { get; set; }
    public bool IsActive { get; set; }
    public Guid? RelatedAgentId { get; set; }
}