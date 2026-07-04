namespace OpenCMS.CMS.Application.Dispatches.Self.Delete;

public class Handler : IRequestHandler<Command, Result<CommandResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public Handler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CommandResponse>> Handle(Command request, CancellationToken cancellationToken)
    {
        var dispatch = await _dbContext.Dispatches.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (dispatch == null)
            return Error.NotFound;

        _dbContext.Dispatches.Remove(dispatch);
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
