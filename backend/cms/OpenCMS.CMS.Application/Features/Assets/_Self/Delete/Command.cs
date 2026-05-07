namespace OpenCMS.CMS.Application.Assets.Self.Delete;

public class Command : IRequest<Asset?>
{
    public Guid Id { get; set; }
}
