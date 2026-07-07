namespace OpenCMS.CMS.Application.Dispatches.Self.Create;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IAgentSocketService _agentSocketService;

    public Handler(IApplicationDbContext dbContext, IAgentSocketService agentSocketService)
    {
        _dbContext = dbContext;
        _agentSocketService = agentSocketService;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var dispatch = new Dispatch
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            OccuredAt = request.OccuredAt,
            RelatedEntityId = request.RelatedEntityId,
            RelatedChildEntityId = request.RelatedChildEntityId,
            ProviderAgentId = request.ProviderAgentId
        };

        _dbContext.Dispatches.Add(dispatch);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var providerAgent = await _dbContext.Agents
            .FirstOrDefaultAsync(a => a.Id == dispatch.ProviderAgentId, cancellationToken);

        var response = new CommandResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            ProviderAgentName = providerAgent?.Name ?? "Unknown",
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt
        };

        await _agentSocketService.CreateDispatch(response, cancellationToken);

        return response;
    }
}
