using Microsoft.AspNetCore.Builder;

namespace OpenCMS.CMS.Application.Configurations.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app)
    {
        // Agents
        OpenCMS.CMS.Application.Agents.Self.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.GetById.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.Update.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.Delete.Endpoint.MapEndpoint(app);
        // Assets
        OpenCMS.CMS.Application.Assets.Self.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Assets.Self.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Assets.Self.GetById.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Assets.Self.Update.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Assets.Self.Delete.Endpoint.MapEndpoint(app);
        // Operation
        OpenCMS.CMS.Application.Operations.Self.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Self.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Self.GetById.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Self.Delete.Endpoint.MapEndpoint(app);
        // Operation Assets
        OpenCMS.CMS.Application.Operations.OperationAssets.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.OperationAssets.Delete.Endpoint.MapEndpoint(app);
        // Operation Orders
        OpenCMS.CMS.Application.Operations.Orders.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Orders.Update.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Orders.Delete.Endpoint.MapEndpoint(app);
    }
}