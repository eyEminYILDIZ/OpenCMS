namespace OpenCMS.CMS.Application.Operations.Self.GetById;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations/{id}", async (Guid id, IMediator mediator) =>
        {
            var operation = await mediator.Send(new Query { Id = id });
            return operation;
        });
    }
}
