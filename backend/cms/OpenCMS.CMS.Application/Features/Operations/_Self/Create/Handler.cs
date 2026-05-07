namespace OpenCMS.CMS.Application.Operations.Create;

public class Handler : IRequestHandler<Command, Operation>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Operation> Handle(Command request, CancellationToken cancellationToken)
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

        return operation;
    }
}
