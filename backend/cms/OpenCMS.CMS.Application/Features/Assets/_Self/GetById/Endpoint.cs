namespace OpenCMS.CMS.Application.Assets.Self.GetById;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets/{id}", async (Guid id, IMediator mediator) =>
        {
            var asset = await mediator.Send(new Query { Id = id });
            return asset is null
                ? TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)
                : TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200);
        });
    }
}
