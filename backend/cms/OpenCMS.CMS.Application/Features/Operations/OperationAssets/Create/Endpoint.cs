namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/assets", async (Command command, IMediator mediator) =>
        {
            var operationAsset = await mediator.Send(command);
            return TypedResults.Json(ApiResponse.Ok(operationAsset), statusCode: 200);
        });
    }
}