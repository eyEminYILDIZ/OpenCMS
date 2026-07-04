using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Dispatches.Self.ListFiltered;

public class Endpoint : IClientEndpoint, IAgentEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/dispatches/filtered", async (IMediator mediator, [FromQuery] Guid relatedEntityId) =>
        {
            var result = await mediator.Send(new Query()
            {
                RelatedEntityId = relatedEntityId
            });
            return result.ToHttpResult();
        });
    }
}
