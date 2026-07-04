namespace OpenCMS.CMS.Application.Dispatches.Self.Create;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/dispatches", async (Command command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}
