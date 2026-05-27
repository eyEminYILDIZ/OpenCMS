namespace OpenCMS.CMS.Application.Agents.Self.GetItemCounts;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents/counts", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new Query());
            return result.ToHttpResult();
        });
    }
}
