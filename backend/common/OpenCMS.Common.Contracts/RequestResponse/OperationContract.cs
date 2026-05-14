namespace OpenCMS.Common.Contracts.RequestResponse;

public class Operation
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EstimatedEndDate { get; set; }
    public DateTime? EndDate { get; set; }
    public OperationStatusContract OperationStatus { get; set; }
    public OperationTypeContract OperationType { get; set; }

    public List<AssetContract> Assets { get; set; }
    public List<OrderContract> Orders { get; set; }
}

public enum OperationTypeContract
{
    Intercept = 0,
    Rescue = 1,
    Capture = 2,
    Exterminate = 3,
    Exchange = 4,
}


public enum ObjectiveStatusContract
{
    NotEvaluated = 0,
    Achieved = 1,
    PartiallyAchieved = 2,
    Failed = 3,
}

public enum OperationStatusContract
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    OnHold = 3,
    Cancelled = 4
}