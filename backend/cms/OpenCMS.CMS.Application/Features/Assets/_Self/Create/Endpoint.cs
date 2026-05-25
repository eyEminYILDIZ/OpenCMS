namespace OpenCMS.CMS.Application.Assets.Self.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/assets", async (Command command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}
