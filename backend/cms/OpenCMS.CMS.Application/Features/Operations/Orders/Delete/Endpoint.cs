namespace OpenCMS.CMS.Application.Operations.Orders.Delete;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapDelete("/operations/orders/{id}", async (Guid id, IMediator mediator) =>
        {
            var deleted = await mediator.Send(new Command { Id = id });
            return deleted is null
                ? TypedResults.Json(ApiResponse.NotFound("Order not found."), statusCode: 404)
                : TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200);
        });
    }
}
