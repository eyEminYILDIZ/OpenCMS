namespace OpenCMS.CMS.Application.Dispatches.Self.Delete;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/dispatches/{id}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new Command { Id = id });
            return result.ToHttpResult();
        });
    }
}
