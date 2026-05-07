namespace OpenCMS.CMS.Application.Operations.Orders.Update;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/operations/orders/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var order = await mediator.Send(command);
            return order;
        });
    }
}
