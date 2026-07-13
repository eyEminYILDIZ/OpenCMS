using OpenCMS.Agent.AutonomousDrone.Models;

var builder = Host.CreateApplicationBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddHttpClient();

var agentId = Guid.Parse(builder.Configuration["Agent:AgentId"]!);
var assetId = Guid.Parse(builder.Configuration["Agent:AssetId"]!);
var baseUrl = builder.Configuration["OpenCMS:BaseUrl"]!;

var host = builder.Build();
await host.StartAsync();

var loggerFactory = host.Services.GetRequiredService<ILoggerFactory>();
var httpClientFactory = host.Services.GetRequiredService<IHttpClientFactory>();
var logger = loggerFactory.CreateLogger("AirAutonomousDrone");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>(), false);
var agentState = new AgentState(agentId, assetId, "Air Defence Gun Agent", AssetTypes.AirGun, ThreatTypes.Own);
var world = new ThreeDimensionWorld();
world.AddAsset(agentState.GetSelfAsset());
var autonomousDrone = new AutonomousDrone(agentState, world, loggerFactory.CreateLogger<AutonomousDrone>(), true);
agentState.UpdateState(41.0411240853284, 29.0081058259891, 0, 205, 0);


var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) =>
{
    e.Cancel = true;
    cts.Cancel();
};

logger.LogInformation("Air Defence Gun agent started");
while (!cts.Token.IsCancellationRequested)
{
    try
    {
        var pingResult = await openCmsClient.Ping();
        logger.LogInformation("Ping {Result}", pingResult ? "succeeded" : "failed");

        var selfAsset = agentState.GetSelfAsset();
        var selfFeedResult = await openCmsClient.FeedAsset(selfAsset);
        logger.LogInformation("Self asset feed {Result}", selfFeedResult ? "succeeded" : "failed");

        var activeOperations = await openCmsClient.GetActiveOperations();
        logger.LogInformation("Received {Count} active operation(s)", activeOperations.Count);

        // detect operation
        OpenCMS.CMS.Application.Operations.Self.GetById.ResponseModel operation = null;
        OpenCMS.CMS.Application.Operations.Self.GetById.OperationAssetResponse operationAsset = null;
        foreach (var activeOperation in activeOperations)
        {
            operation = await openCmsClient.GetOperation(activeOperation.Id);

            logger.LogInformation("Active operation {OperationId} — Name: {Name}, Type: {Type}, Status: {Status}",
                operation.Id, operation.Name, operation.OperationType, operation.OperationStatus);

            operationAsset = operation.OperationAssets.FirstOrDefault(a => a.Asset.RelatedAgentId == agentId);
            if (operationAsset == null)
            {
                logger.LogDebug("No asset assigned to this agent in operation {OperationId}", operation.Id);
                continue;
            }

            if (operation != null)
                break;
        }

        // detect waypoints
        var waypoints = new List<SteerPoint>();
        foreach (var order in operation.Orders)
        {
            if (order.OrderStatus == OrderStatus.NotStarted || order.ResponsibleOperationAssetId != operationAsset.Id)
            {
                logger.LogDebug("Skipping order {OrderId} — Type: {Type}, Status: {Status}",
                    order.Id, order.OrderType, order.OrderStatus);
                continue;
            }

            logger.LogInformation("Executing order {OrderId} — Type: {Type}, Target: {Lat}/{Lon}",
                order.Id, order.OrderType, order.TargetPointLatitude, order.TargetPointLongitude);

            var steerpoint = new SteerPoint(order.Code, order.TargetPointLatitude, order.TargetPointLongitude, order.TargetPointAltitude, order.TargetPointHeading, order.TargetPointSpeed);
            waypoints.Add(steerpoint);
        }

        // set waypoints and start autonomous drone
        autonomousDrone.SetSteerPoints(waypoints);
        await autonomousDrone.Start();

        // main work loop
        var index = 0;
        var isWorking = true;
        while (isWorking && !cts.Token.IsCancellationRequested)
        {
            var workResult = await autonomousDrone.Work();
            if (!workResult)
            {
                logger.LogWarning("Autonomous drone is not working anymore...");
                isWorking = false;
            }

            // inform CMS about changings
            index++;
            if (index % 10 == 0)
            {
                var continousAssetFeedResult = false;
                try
                {
                    continousAssetFeedResult = await openCmsClient.FeedAsset(agentState.GetSelfAsset());
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
            }

            await Task.Delay(100, cts.Token).ConfigureAwait(false);
        }
    }
    catch (OperationCanceledException)
    {
        break;
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error in agent loop");
    }

    await Task.Delay(5000, cts.Token).ConfigureAwait(false);
}

logger.LogInformation("Air Defence Gun agent shutting down");
await host.StopAsync();
