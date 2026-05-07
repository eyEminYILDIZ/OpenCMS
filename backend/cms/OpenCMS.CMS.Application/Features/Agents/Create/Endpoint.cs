using Microsoft.AspNetCore.Builder;
using MediatR;

namespace OpenCMS.CMS.Application.Agents.Create;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/agents", async (Command command, IMediator mediator) =>
        {
            var agent = await mediator.Send(command);
            return agent;
        });
    }
}
