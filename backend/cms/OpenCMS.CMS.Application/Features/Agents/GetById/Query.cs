namespace OpenCMS.CMS.Application.Agents.Self.GetById;

public class Query : IRequest<Agent?>
{
    public Guid Id { get; set; }
}
