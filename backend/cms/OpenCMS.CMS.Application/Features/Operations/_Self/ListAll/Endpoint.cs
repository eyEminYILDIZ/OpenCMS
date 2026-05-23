namespace OpenCMS.CMS.Application.Operations.Self.ListAll;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations", async (IMediator mediator) =>
        {
            var operations = await mediator.Send(new Query());
            return TypedResults.Json(ApiResponse.Ok(operations), statusCode: 200);
        });
    }
}
