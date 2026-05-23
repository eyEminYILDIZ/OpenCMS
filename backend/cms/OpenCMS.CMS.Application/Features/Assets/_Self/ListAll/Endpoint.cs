namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets", async (IMediator mediator) =>
        {
            var assets = await mediator.Send(new Query());
            return TypedResults.Json(ApiResponse.Ok(assets), statusCode: 200);
        });
    }
}
