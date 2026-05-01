namespace OpenCMS.CMS.Domain.Entities;

public class Operation : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EstimatedEndDate { get; set; }
    public DateTime? EndDate { get; set; }
    public OperationStatus OperationStatus { get; set; }
    public OperationType OperationType { get; set; }
}

public enum OperationType
{
    Intercept = 0,
    Rescue = 1,
    Capture = 2,
    Exterminate = 3,
}


public enum ObjectiveStatus
{
    NotEvaluated = 0,
    Achieved = 1,
    PartiallyAchieved = 2,
    Failed = 3,
}

public enum OperationStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    OnHold = 3,
    Cancelled = 4
}