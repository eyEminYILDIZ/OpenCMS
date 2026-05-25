namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new Query());
            return result.ToHttpResult();
        });
    }
}
