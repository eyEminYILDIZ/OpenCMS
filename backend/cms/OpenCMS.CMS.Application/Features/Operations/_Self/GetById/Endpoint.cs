using Microsoft.AspNetCore.Builder;
using MediatR;

namespace OpenCMS.CMS.Application.Operations.GetById;

public class Endpoint
{
    public static RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapGet("/operations/{id}", async (Guid id, IMediator mediator) =>
        {
            var operation = await mediator.Send(new Query { Id = id });
            return operation;
        });
    }
}
