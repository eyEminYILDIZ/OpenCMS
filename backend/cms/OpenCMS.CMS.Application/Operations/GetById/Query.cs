namespace OpenCMS.CMS.Application.Operations.GetById;

public class Query : IRequest<ResponseModel?>
{
    public Guid Id { get; set; }
}
