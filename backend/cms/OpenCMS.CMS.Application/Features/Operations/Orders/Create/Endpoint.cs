namespace OpenCMS.CMS.Application.Operations.Orders.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/orders", async (Command command, IMediator mediator) =>
        {
            var order = await mediator.Send(command);
            return order;
        });
    }
}
