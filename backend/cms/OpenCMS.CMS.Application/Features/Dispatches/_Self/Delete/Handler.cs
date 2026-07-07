namespace OpenCMS.CMS.Application.Dispatches.Self.Delete;

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
        var dispatch = await _dbContext.Dispatches.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (dispatch == null)
            return Error.NotFound;

        _dbContext.Dispatches.Remove(dispatch);
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

        await _agentSocketService.DeleteDispatch(response, cancellationToken);

        return response;
    }
}
