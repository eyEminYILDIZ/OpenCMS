namespace OpenCMS.CMS.Application.Agents.Self.Delete;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/agents/{id}", async (Guid id, IMediator mediator) =>
        {
            var deleted = await mediator.Send(new Command { Id = id });
            return deleted is null
                ? TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)
                : TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200);
        });
    }
}
