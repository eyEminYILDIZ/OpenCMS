namespace OpenCMS.CMS.Application.Agents.Self.GetById;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents/{id}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new Query { Id = id });
            return result.ToHttpResult();
        });
    }
}
