namespace OpenCMS.CMS.Application.Dispatches.Self.Delete;

public class Command : IRequest<Result<CommandResponse>>
{
    public Guid Id { get; set; }
}

public class CommandResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DispatchCategories Category { get; set; }
    public DateTime OccuredAt { get; set; }
    public Guid RelatedEntityId { get; set; }
    public Guid? RelatedChildEntityId { get; set; }
    public Guid ProviderAgentId { get; set; }
    public string ProviderAgentName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
