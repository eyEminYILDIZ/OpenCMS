namespace OpenCMS.CMS.Application.Operations.Self.Delete;

public class Command : IRequest<CommandResponse?>
{
    public Guid Id { get; set; }
}

public class CommandResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EstimatedEndDate { get; set; }
    public DateTime? EndDate { get; set; }
    public OperationStatus OperationStatus { get; set; }
    public OperationType OperationType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
