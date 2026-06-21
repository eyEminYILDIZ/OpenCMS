namespace OpenCMS.CMS.Application.Operations.Self.ListAll;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var operationQuery = _dbContext.Operations.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchValue))
        {
            operationQuery = operationQuery.Where(o => o.Name.ToLower().Contains(request.SearchValue.ToLower()));
        }

        var operations = await operationQuery.ToListAsync(cancellationToken);

        return operations.Select(operation => new QueryResponse
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
        }).ToList();
    }
}
