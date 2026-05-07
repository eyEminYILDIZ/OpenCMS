namespace OpenCMS.CMS.Application.Agents.GetById;

public class Query : IRequest<Agent?>
{
    public Guid Id { get; set; }
}
