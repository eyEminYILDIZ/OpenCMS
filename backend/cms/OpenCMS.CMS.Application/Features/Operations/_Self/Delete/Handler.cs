namespace OpenCMS.CMS.Application.Operations.Self.Delete;

public class Handler : IRequestHandler<Command, CommandResponse?>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommandResponse?> Handle(Command request, CancellationToken cancellationToken)
    {
        var operation = await _dbContext.Operations.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (operation == null)
            return null;

        _dbContext.Operations.Remove(operation);
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
