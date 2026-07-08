using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.Orders.Pick;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/orders/pick", async (IMediator mediator, Query query) =>
        {
            var result = await mediator.Send(query);
            return result.ToHttpResult();
        });
    }
}
