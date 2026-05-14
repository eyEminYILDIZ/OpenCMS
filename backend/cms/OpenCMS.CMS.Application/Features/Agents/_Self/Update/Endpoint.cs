namespace OpenCMS.CMS.Application.Agents.Self.Update;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/agents/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var agent = await mediator.Send(command);
            return agent;
        });
    }
}
