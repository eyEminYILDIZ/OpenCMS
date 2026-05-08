namespace OpenCMS.CMS.Application.Agents.Self.Ping;

public class Command : IRequest<Agent?>
{
    public Guid Id { get; set; }
    public DateTime SentAt { get; set; }
}
