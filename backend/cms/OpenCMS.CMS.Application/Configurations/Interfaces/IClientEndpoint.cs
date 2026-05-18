namespace OpenCMS.CMS.Application.Configurations.Interfaces
{
    public interface IClientEndpoint
    {
        RouteHandlerBuilder MapEndpoint(WebApplication app);
    }
}