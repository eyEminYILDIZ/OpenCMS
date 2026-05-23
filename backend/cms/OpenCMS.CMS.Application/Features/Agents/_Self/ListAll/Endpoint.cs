namespace OpenCMS.CMS.Application.Agents.Self.ListAll;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents", async (IMediator mediator) =>
        {
            var agents = await mediator.Send(new Query());
            return TypedResults.Json(ApiResponse.Ok(agents), statusCode: 200);
        });
    }
}
