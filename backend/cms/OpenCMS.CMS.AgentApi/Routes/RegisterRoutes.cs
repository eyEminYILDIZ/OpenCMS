using Microsoft.AspNetCore.Builder;

namespace OpenCMS.CMS.ClientApi.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app)
    {
        // Agents
        OpenCMS.CMS.Application.Agents.Self.Ping.Endpoint.MapEndpoint(app);
        // Assets
        OpenCMS.CMS.Application.Assets.Self.Feed.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Assets.Self.ListAll.Endpoint.MapEndpoint(app);
        // Operations
        OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.Endpoint.MapEndpoint(app);
    }
}