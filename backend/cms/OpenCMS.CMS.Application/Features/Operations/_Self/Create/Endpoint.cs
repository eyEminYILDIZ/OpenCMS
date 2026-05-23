namespace OpenCMS.CMS.Application.Operations.Self.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations", async (Command command, IMediator mediator) =>
        {
            var operation = await mediator.Send(command);
            return TypedResults.Json(ApiResponse.Ok(operation), statusCode: 200);
        });
    }
}
