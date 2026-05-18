namespace OpenCMS.CMS.ClientApi.Routes;

public static class RegisterRoutes
{
    public static void MapRoutes(WebApplication app, Assembly assembly)
    {
        var endpointTypes = assembly.GetTypes().Where(t => t.IsClass && !t.IsAbstract && typeof(IClientEndpoint).IsAssignableFrom(t));
        foreach (var endpointType in endpointTypes)
        {
            var endpointInstance = (IClientEndpoint)Activator.CreateInstance(endpointType)!;
            endpointInstance.MapEndpoint(app);

            System.Console.WriteLine($"Registered endpoint: {endpointType.FullName}");
        }
        System.Console.WriteLine($"Total registered endpoints: {endpointTypes.Count()}");
    }
}