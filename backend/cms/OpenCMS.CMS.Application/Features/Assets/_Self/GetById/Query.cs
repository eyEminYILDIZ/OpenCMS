namespace OpenCMS.CMS.Application.Assets.Self.GetById;

public class Query : IRequest<Asset?>
{
    public Guid Id { get; set; }
}
