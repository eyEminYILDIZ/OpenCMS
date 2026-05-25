namespace OpenCMS.CMS.Application.Operations.Self.Delete;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/operations/{id}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new Command { Id = id });
            return result.ToHttpResult();
        });
    }
}
