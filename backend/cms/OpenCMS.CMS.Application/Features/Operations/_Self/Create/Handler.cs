namespace OpenCMS.CMS.Application.Operations.Self.Create;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var operation = new Operation
        {
            Name = request.Name,
            Description = request.Description,
            StartDate = request.StartDate,
            EstimatedEndDate = request.EstimatedEndDate,
            OperationStatus = request.OperationStatus,
            OperationType = request.OperationType
        };
        _dbContext.Operations.Add(operation);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommandResponse
        {
            Id = operation.Id,
            Name = operation.Name,
            Description = operation.Description,
            StartDate = operation.StartDate,
            EstimatedEndDate = operation.EstimatedEndDate,
            EndDate = operation.EndDate,
            OperationStatus = operation.OperationStatus,
            OperationType = operation.OperationType,
            CreatedAt = operation.CreatedAt,
            UpdatedAt = operation.UpdatedAt
        };
    }
}
