namespace OpenCMS.CMS.Application.Assets.Self.GetById;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets/{id}", async (Guid id, IMediator mediator) =>
        {
            var asset = await mediator.Send(new Query { Id = id });
            return asset;
        });
    }
}
