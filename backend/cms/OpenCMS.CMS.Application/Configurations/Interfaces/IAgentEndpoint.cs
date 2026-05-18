namespace OpenCMS.CMS.Application.Configurations.Interfaces
{
    public interface IAgentEndpoint
    {
        RouteHandlerBuilder MapEndpoint(WebApplication app);
    }
}