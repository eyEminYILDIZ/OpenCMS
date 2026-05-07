namespace OpenCMS.CMS.Application.Operations.Self.GetById;

public class Query : IRequest<ResponseModel?>
{
    public Guid Id { get; set; }
}
