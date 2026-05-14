namespace OpenCMS.CMS.Application.Agents.Self.GetById;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents/{id}", async (Guid id, IMediator mediator) =>
        {
            var agent = await mediator.Send(new Query { Id = id });
            return agent;
        });
    }
}
