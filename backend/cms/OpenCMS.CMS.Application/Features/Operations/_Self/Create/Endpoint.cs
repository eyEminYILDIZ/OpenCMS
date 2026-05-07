using Microsoft.AspNetCore.Builder;
using MediatR;

namespace OpenCMS.CMS.Application.Operations.Self.Create;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations", async (Command command, IMediator mediator) =>
        {
            var operation = await mediator.Send(command);
            return operation;
        });
    }
}
