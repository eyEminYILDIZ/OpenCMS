namespace OpenCMS.CMS.Application.Operations.Orders.Delete;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/operations/orders/{id}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new Command { Id = id });
            return result.ToHttpResult();
        });
    }
}
