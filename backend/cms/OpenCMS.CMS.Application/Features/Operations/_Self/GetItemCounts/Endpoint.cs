namespace OpenCMS.CMS.Application.Operations.Self.GetItemCounts;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations/counts", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new Query());
            return result.ToHttpResult();
        });
    }
}
