namespace OpenCMS.CMS.Application.Assets.Self.GetItemCounts;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets/counts", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new Query());
            return result.ToHttpResult();
        });
    }
}
