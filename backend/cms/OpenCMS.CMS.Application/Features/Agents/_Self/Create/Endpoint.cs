namespace OpenCMS.CMS.Application.Agents.Self.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/agents", async (Command command, IMediator mediator) =>
        {
            var agent = await mediator.Send(command);
            return TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200);
        });
    }
}
