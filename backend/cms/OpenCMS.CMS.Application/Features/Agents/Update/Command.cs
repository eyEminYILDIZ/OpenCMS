namespace OpenCMS.CMS.Application.Agents.Update;

public class Command : IRequest<Agent?>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
