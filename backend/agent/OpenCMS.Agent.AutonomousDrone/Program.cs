using OpenCMS.Libraries.FlightComputer.Models;

var builder = Host.CreateApplicationBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddHttpClient();

var baseUrl = builder.Configuration["OpenCMS:BaseUrl"]!;
var agentId = Guid.Parse(builder.Configuration["Agent:AgentId"]!);
var agentName = builder.Configuration["Agent:Name"]!;
var assetId = Guid.Parse(builder.Configuration["Agent:AssetId"]!);
var latitude = double.Parse(builder.Configuration["Agent:Latitude"]!);
var longitude = double.Parse(builder.Configuration["Agent:Longitude"]!);
var altitude = double.Parse(builder.Configuration["Agent:Altitude"]!);
var heading = double.Parse(builder.Configuration["Agent:Heading"]!);
var speed = double.Parse(builder.Configuration["Agent:Speed"]!);

var host = builder.Build();
await host.StartAsync();

var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) =>
{
    e.Cancel = true;
    cts.Cancel();
};

var loggerFactory = host.Services.GetRequiredService<ILoggerFactory>();
var httpClientFactory = host.Services.GetRequiredService<IHttpClientFactory>();
var logger = loggerFactory.CreateLogger("AutonomousDrone");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>(), false);
var operationService = new OperationService(builder.Configuration, openCmsClient, loggerFactory.CreateLogger<OperationService>());

var agentState = new AgentState(agentId, assetId, agentName, AssetTypesContract.Drone, ThreatTypesContract.Own);
var world = new ThreeDimensionWorld();
world.AddAsset(agentState);
var autonomousDrone = new AutonomousDrone(agentState, world, loggerFactory.CreateLogger<AutonomousDrone>(), cts.Token, true);
agentState.UpdateState(latitude, longitude, altitude, heading, speed);

autonomousDrone.SetAgentStateUpdateCallback(async (AgentState agentState) =>
{
    try
    {
        var continousAssetFeedResult = await openCmsClient.FeedAsset(agentState);
        if (!continousAssetFeedResult)
        {
            logger.LogWarning("Failed to feed self asset to CMS");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error feeding self asset");
        logger.LogInformation(ex.Message);
        logger.LogInformation(ex.InnerException?.Message);
    }
});


logger.LogInformation("Autonomous Drone agent started");

_ = Task.Run(async () =>
{
    while (!cts.Token.IsCancellationRequested)
    {
        try
        {
            var pingResult = await openCmsClient.Ping();
            logger.LogInformation("Ping {Result}", pingResult ? "succeeded" : "failed");

            var selfFeedResult = await openCmsClient.FeedAsset(agentState);
            logger.LogInformation("Self asset feed {Result}", selfFeedResult ? "succeeded" : "failed");
        }
        catch (OperationCanceledException)
        {
            break;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in ping and feed loop");
        }

        await Task.Delay(5000, cts.Token).ConfigureAwait(false);
    }
}, cts.Token);


// TODO: handle if there are no active operations or waypoints
var waypoints = await operationService.GetActiveOperationWayPoints();

// set waypoints and start autonomous drone
autonomousDrone.SetWayPoints(waypoints);
await autonomousDrone.Start();

while (!cts.Token.IsCancellationRequested)
{
    var readKey = Console.ReadKey(intercept: true);
    if (readKey.Key == ConsoleKey.UpArrow)
    {
        System.Console.WriteLine("Moving Forward");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.MoveForward);
    }
    else if (readKey.Key == ConsoleKey.DownArrow)
    {
        System.Console.WriteLine("Moving Backward");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.MoveBackward);
    }
    else if (readKey.Key == ConsoleKey.LeftArrow)
    {
        System.Console.WriteLine("Turning Left");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.TurnLeft);
    }
    else if (readKey.Key == ConsoleKey.RightArrow)
    {
        System.Console.WriteLine("Turning Right");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.TurnRight);
    }
    else if (readKey.Key == ConsoleKey.PageUp)
    {
        System.Console.WriteLine("Moving Up");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.MoveUp);
    }
    else if (readKey.Key == ConsoleKey.PageDown)
    {
        System.Console.WriteLine("Moving Down");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.MoveDown);
    }
    else if (readKey.Key == ConsoleKey.A)
    {
        System.Console.WriteLine("Opening Autopilot");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.OpenAutopilot);
    }
    else if (readKey.Key == ConsoleKey.B)
    {
        System.Console.WriteLine("Closing Autopilot");
        await autonomousDrone.ControlDrone(ActuatorActionTypes.CloseAutopilot);
    }
}

logger.LogInformation("Autonomous Drone agent shutting down");
await host.StopAsync();
