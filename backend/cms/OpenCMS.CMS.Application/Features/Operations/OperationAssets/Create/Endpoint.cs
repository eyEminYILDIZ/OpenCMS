namespace OpenCMS.CMS.Application.Operations.OperationAssets.Create;

public class Endpoint : IClientEndpoint
{
    public RouteHandlerBuilder MapEndpoint(WebApplication app)
    {
        return app.MapPost("/operations/assets", async (Command command, IMediator mediator) =>
        {
            System.Console.WriteLine("Inner");
            System.Console.WriteLine(command.AssetId);
            System.Console.WriteLine(command.OperationId);
            var operationAsset = await mediator.Send(command);
            return operationAsset;
        });
    }
}