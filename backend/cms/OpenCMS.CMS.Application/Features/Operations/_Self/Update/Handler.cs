namespace OpenCMS.CMS.Application.Operations.Self.Update;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var operation = await _dbContext.Operations.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (operation == null)
            return Error.NotFound;

        operation.Name = request.Name;
        operation.Description = request.Description;
        operation.StartDate = request.StartDate;
        operation.EstimatedEndDate = request.EstimatedEndDate;
        operation.OperationStatus = request.OperationStatus;
        operation.OperationType = request.OperationType;

        _dbContext.Operations.Update(operation);
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
