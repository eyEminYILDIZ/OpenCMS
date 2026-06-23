using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.OperationAssets.Pick;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/assets/pick", async (IMediator mediator, Query query) =>
        {
            var result = await mediator.Send(query);
            return result.ToHttpResult();
        });
    }
}
