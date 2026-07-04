namespace OpenCMS.CMS.Application.Dispatches.Self.Update;

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

        dispatch.Title = request.Title;
        dispatch.Description = request.Description;
        dispatch.Category = request.Category;
        dispatch.OccuredAt = request.OccuredAt;
        dispatch.RelatedEntityId = request.RelatedEntityId;
        dispatch.RelatedChildEntityId = request.RelatedChildEntityId;

        _dbContext.Dispatches.Update(dispatch);
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
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt
        };
    }
}
