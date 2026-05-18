namespace OpenCMS.CMS.Application.Operations.OperationAssets.Delete;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/operations/assets/{id}", async (Guid id, IMediator mediator) =>
        {
            var deleted = await mediator.Send(new Command { Id = id });
            return deleted;
        });
    }
}
