using Microsoft.AspNetCore.Builder;

namespace OpenCMS.CMS.AgentApi.Configurations.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app)
    {
        OpenCMS.CMS.Application.Agents.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Create.Endpoint.MapEndpoint(app);
    }
}