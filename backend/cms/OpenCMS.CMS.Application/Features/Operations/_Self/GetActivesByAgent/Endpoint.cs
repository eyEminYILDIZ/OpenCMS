namespace OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations", async (IMediator mediator) =>
        {
            var operations = await mediator.Send(new Query());
            return operations;
        });
    }
}
