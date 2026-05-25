namespace OpenCMS.CMS.Application.Operations.Self.GetById;

public class Query : IRequest<Result<ResponseModel>>
{
    public Guid Id { get; set; }
}
