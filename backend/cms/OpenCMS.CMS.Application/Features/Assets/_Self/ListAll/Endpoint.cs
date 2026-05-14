namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets", async (IMediator mediator) =>
        {
            var assets = await mediator.Send(new Query());
            return assets;
        });
    }
}
