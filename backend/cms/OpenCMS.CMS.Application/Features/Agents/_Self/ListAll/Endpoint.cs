using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Agents.Self.ListAll;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents", async (IMediator mediator, [FromQuery] string? search) =>
        {
            var result = await mediator.Send(new Query()
            {
                SearchValue = search ?? ""
            });
            return result.ToHttpResult();
        });
    }
}
