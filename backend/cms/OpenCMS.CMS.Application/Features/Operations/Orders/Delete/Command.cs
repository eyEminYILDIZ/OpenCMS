namespace OpenCMS.CMS.Application.Operations.Orders.Delete;

public class Command : IRequest<Order?>
{
    public Guid Id { get; set; }
}
