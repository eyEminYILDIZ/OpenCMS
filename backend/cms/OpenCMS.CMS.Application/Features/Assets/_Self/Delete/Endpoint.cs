namespace OpenCMS.CMS.Application.Assets.Self.Delete;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/assets/{id}", async (Guid id, IMediator mediator) =>
        {
            var deleted = await mediator.Send(new Command { Id = id });
            return deleted;
        });
    }
}
