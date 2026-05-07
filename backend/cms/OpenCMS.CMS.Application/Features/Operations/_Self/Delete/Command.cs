namespace OpenCMS.CMS.Application.Operations.Self.Delete;

public class Command : IRequest<Operation?>
{
    public Guid Id { get; set; }
}
