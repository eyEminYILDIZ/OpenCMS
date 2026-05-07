namespace OpenCMS.CMS.Application.Agents.Self.Create;

public class Command : IRequest<Agent>
{
    public string Name { get; set; }
}
