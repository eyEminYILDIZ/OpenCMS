using Microsoft.AspNetCore.Mvc;

namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations/GetActivesByAgent", async ([FromBody] Query query, [FromServices] IMediator mediator) =>
        {
            var operations = await mediator.Send(query);
            return operations;
        });
    }
}
