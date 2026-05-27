namespace OpenCMS.CMS.Application.Operations.Self.GetItemCounts;

public class Handler : IRequestHandler<Query, Result<QueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<QueryResponse>> Handle(Query request, CancellationToken cancellationToken)
    {
        var activeCount = await _dbContext.Operations.CountAsync(
            o => o.OperationStatus == OperationStatus.NotStarted || o.OperationStatus == OperationStatus.InProgress,
            cancellationToken);

        var inactiveCount = await _dbContext.Operations.CountAsync(
            o => o.OperationStatus == OperationStatus.Completed
              || o.OperationStatus == OperationStatus.OnHold
              || o.OperationStatus == OperationStatus.Cancelled,
            cancellationToken);

        return new QueryResponse
        {
            ActiveCount = activeCount,
            InactiveCount = inactiveCount
        };
    }
}
