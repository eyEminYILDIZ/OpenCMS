using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.Self.ListAll;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations", async (IMediator mediator, [FromQuery] string? search) =>
        {
            var result = await mediator.Send(new Query()
            {
                SearchValue = search ?? ""
            });
            return result.ToHttpResult();
        });
    }
}
