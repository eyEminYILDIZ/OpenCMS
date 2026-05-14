namespace OpenCMS.CMS.Application.Assets.Self.Create;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/assets", async (Command command, IMediator mediator) =>
        {
            var asset = await mediator.Send(command);
            return asset;
        });
    }
}
