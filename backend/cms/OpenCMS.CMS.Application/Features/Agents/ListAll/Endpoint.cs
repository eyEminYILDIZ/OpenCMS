using Microsoft.AspNetCore.Builder;
using MediatR;

namespace OpenCMS.CMS.Application.Agents.Self.ListAll;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/agents", async (IMediator mediator) =>
        {
            var agents = await mediator.Send(new Query());
            return agents;
        });
    }
}
