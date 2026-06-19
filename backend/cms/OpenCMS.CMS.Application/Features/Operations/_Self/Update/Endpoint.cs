namespace OpenCMS.CMS.Application.Operations.Self.Update;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPut("/operations/{id}", async (Guid id, Command command, IMediator mediator) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result.ToHttpResult();
        });
    }
}
