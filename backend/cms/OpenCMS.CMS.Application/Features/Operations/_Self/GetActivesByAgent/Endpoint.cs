using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/GetActivesByAgent", async ([FromBody] Query query, [FromServices] IMediator mediator) =>
        {
            var result = await mediator.Send(query);
            return result.ToHttpResult();
        });
    }
}
