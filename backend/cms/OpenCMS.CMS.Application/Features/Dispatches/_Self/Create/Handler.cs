namespace OpenCMS.CMS.Application.Dispatches.Self.Create;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
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

        return new CommandResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt
        };
    }
}
