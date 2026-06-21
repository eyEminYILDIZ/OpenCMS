using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Assets.Self.ListAll;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets", async (IMediator mediator, [FromQuery] string? search) =>
        {
            var result = await mediator.Send(new Query()
            {
                SearchValue = search ?? ""
            });
            return result.ToHttpResult();
        });
    }
}
