namespace OpenCMS.CMS.Application.Agents.Self.Ping;

public class Endpoint : IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/agents/{id}/ping", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var agent = await mediator.Send(command);
            return agent is null
                ? TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)
                : TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200);
        });
    }
}
