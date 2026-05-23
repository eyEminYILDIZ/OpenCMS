namespace OpenCMS.CMS.Application.Assets.Self.Feed;

public class Endpoint : IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/assets/{id}/feed", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var asset = await mediator.Send(command);
            return asset is null
                ? TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)
                : TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200);
        });
    }
}
