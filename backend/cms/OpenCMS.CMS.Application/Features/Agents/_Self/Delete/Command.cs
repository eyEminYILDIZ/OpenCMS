namespace OpenCMS.CMS.Application.Agents.Self.Delete;

public class Command : IRequest<Agent?>
{
    public Guid Id { get; set; }
}
