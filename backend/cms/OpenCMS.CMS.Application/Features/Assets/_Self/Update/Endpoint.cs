namespace OpenCMS.CMS.Application.Assets.Self.Update;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/assets/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var asset = await mediator.Send(command);
            return asset;
        });
    }
}
