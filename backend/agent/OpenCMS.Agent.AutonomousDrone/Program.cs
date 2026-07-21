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
var isLoggingEnabled = false;

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
var autonomousDrone = new AutonomousDrone(agentState, world, loggerFactory.CreateLogger<AutonomousDrone>(), cts.Token, isLoggingEnabled);
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

// Ping constantly to OpenCMS and feed self asset
_ = Task.Run(async () =>
{
    while (!cts.Token.IsCancellationRequested)
    {
        try
        {
            var pingResult = await openCmsClient.Ping();
            if (!pingResult)
                logger.LogInformation("Ping failed");

            var selfFeedResult = await openCmsClient.FeedAsset(agentState);
            if (!selfFeedResult)
                logger.LogInformation("Self asset feed failed");

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

// render flight displays
var flightComputer = autonomousDrone.GetFlightComputer();
var flightDisplay = new OpenCmsFlightDisplay(flightComputer);
var isFlightDisplayInitialized = flightDisplay.Initialize();
if (!isFlightDisplayInitialized)
{
    logger.LogWarning("Flight display initialization failed");
}

// render constantly in a separate task to avoid blocking the main control loop
_ = Task.Run(async () =>
{
    while (!cts.Token.IsCancellationRequested)
    {
        try
        {
            flightDisplay.Render();
        }
        catch (OperationCanceledException)
        {
            break;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in flight display rendering loop");
        }

        await Task.Delay(50, cts.Token).ConfigureAwait(false);
    }
}, cts.Token);


// Detect input controller
IInputController inputController = new LogitechExtreme3dProInputController();
var isInputControllerInitialized = inputController.Initialize(AircraftTypes.Drone);
if (!isInputControllerInitialized)
{
    inputController.Dispose();
    inputController = new KeyboardInputController();
    inputController.Initialize(AircraftTypes.Drone);
}

// control drone by input controller
while (!cts.Token.IsCancellationRequested)
{
    var instruction = inputController.ProcessInput(cts.Token);
    await autonomousDrone.ControlDrone(instruction.Action, instruction.Value);
    await Task.Delay(33, cts.Token); // Adjust the delay as needed
}

logger.LogInformation("Autonomous Drone agent shutting down");
autonomousDrone.Dispose();
await host.StopAsync();
