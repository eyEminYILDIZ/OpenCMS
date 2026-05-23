using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/GetActivesByAgent", async ([FromBody] Query query, [FromServices] IMediator mediator) =>
        {
            var operations = await mediator.Send(query);
            return TypedResults.Json(ApiResponse.Ok(operations), statusCode: 200);
        });
    }
}
