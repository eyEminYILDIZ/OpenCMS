using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Dispatches.Self.ListAll;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/dispatches", async (IMediator mediator, [FromQuery] string? search) =>
        {
            var result = await mediator.Send(new Query()
            {
                SearchValue = search ?? ""
            });
            return result.ToHttpResult();
        });
    }
}
