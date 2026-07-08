namespace OpenCMS.CMS.Application.Operations.Orders.ChangeStatus;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/operations/orders/{id}/change-status", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}
