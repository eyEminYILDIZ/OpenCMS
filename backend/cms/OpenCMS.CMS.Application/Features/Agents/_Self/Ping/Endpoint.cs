namespace OpenCMS.CMS.Application.Agents.Self.Ping;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/agents/{id}/ping", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var agent = await mediator.Send(command);
            return agent;
        });
    }
}
