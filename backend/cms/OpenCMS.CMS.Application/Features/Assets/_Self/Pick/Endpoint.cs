using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Assets.Self.Pick;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/assets/pick", async (IMediator mediator, [FromQuery] string? search) =>
        {
            var result = await mediator.Send(new Query()
            {
                SearchValue = search ?? ""
            });
            return result.ToHttpResult();
        });
    }
}
