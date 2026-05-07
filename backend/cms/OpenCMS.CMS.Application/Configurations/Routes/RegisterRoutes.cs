using Microsoft.AspNetCore.Builder;

namespace OpenCMS.CMS.Application.Configurations.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app)
    {
        OpenCMS.CMS.Application.Agents.Self.ListAll.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.GetById.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Agents.Self.Update.Endpoint.MapEndpoint(app);
        // Operation
        OpenCMS.CMS.Application.Operations.Self.Create.Endpoint.MapEndpoint(app);
        OpenCMS.CMS.Application.Operations.Self.GetById.Endpoint.MapEndpoint(app);
    }
}