namespace OpenCMS.CMS.Application.Dispatches.Self.Update;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/dispatches/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}
