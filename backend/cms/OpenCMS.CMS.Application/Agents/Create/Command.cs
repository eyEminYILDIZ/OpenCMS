namespace OpenCMS.CMS.Application.Agents.Create;

public class Command : IRequest<Agent>
{
    public string Name { get; set; }
}
