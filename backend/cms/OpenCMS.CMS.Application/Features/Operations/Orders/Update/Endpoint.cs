namespace OpenCMS.CMS.Application.Operations.Orders.Update;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/operations/orders/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var order = await mediator.Send(command);
            return order;
        });
    }
}
