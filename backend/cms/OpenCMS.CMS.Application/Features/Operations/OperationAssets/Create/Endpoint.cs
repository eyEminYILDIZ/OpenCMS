namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/assets", async (Command command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}