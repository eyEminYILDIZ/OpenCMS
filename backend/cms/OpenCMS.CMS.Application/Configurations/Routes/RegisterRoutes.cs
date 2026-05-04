using Microsoft.AspNetCore.Builder;

namespace OpenCMS.CMS.Application.Configurations.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app)
    {
        OpenCMS.CMS.Application.Agents.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.GetById.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Update.Endpoint.MapEndpoint(app);
        // Operation 
        OpenCMS.CMS.Application.Operations.GetById.Endpoint.MapEndpoint(app);
    }
}