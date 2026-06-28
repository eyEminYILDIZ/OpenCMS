namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Handler : IRequestHandler<Query, Result<List<QueryResponse>>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<List<QueryResponse>>> Handle(Query request, CancellationToken cancellationToken)
    {
        var operations = await _dbContext.Operations
                                          .Include(x => x.OperationAssets).ThenInclude(x => x.Asset)
                                          .Where(x => x.OperationAssets.Any(a => a.Asset.RelatedAgentId == request.AgentId)
                                                && (x.OperationStatus == OperationStatus.NotStarted
                                                    || x.OperationStatus == OperationStatus.InProgress
                                                    || x.OperationStatus == OperationStatus.OnHold))
                                          .ToListAsync(cancellationToken);

        System.Console.WriteLine(operations.Count);

        return operations.Select(o => new QueryResponse
        {
            Id = o.Id,
            Name = o.Name,
            Description = o.Description,
            StartDate = o.StartDate,
            EstimatedEndDate = o.EstimatedEndDate,
            EndDate = o.EndDate,
            OperationStatus = o.OperationStatus,
            OperationType = o.OperationType,
        }).ToList();
    }
}
