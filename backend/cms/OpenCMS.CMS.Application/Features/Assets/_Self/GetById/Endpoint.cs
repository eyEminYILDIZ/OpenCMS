namespace OpenCMS.CMS.Application.Assets.Self.GetById;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets/{id}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new Query { Id = id });
            return result.ToHttpResult();
        });
    }
}
