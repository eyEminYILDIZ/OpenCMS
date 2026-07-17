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

var loggerFactory = host.Services.GetRequiredService<ILoggerFactory>();
var httpClientFactory = host.Services.GetRequiredService<IHttpClientFactory>();
var logger = loggerFactory.CreateLogger("AirDefenceGun");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>());
var agentState = new AgentState(agentId, assetId, agentName, AssetTypesContract.AirGun, ThreatTypesContract.Own);
var defenceGun = new DefenceGun(agentState, loggerFactory.CreateLogger<DefenceGun>());
agentState.UpdateState(latitude, longitude, altitude, heading, speed);

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

        var selfFeedResult = await openCmsClient.FeedAsset(agentState);
        logger.LogInformation("Self asset feed {Result}", selfFeedResult ? "succeeded" : "failed");

        var activeOperations = await openCmsClient.GetActiveOperations();
        logger.LogInformation("Received {Count} active operation(s)", activeOperations.Count);

        foreach (var activeOperation in activeOperations)
        {
            var operation = await openCmsClient.GetOperation(activeOperation.Id);

            logger.LogInformation("Active operation {OperationId} — Name: {Name}, Type: {Type}, Status: {Status}",
                operation.Id, operation.Name, operation.OperationType, operation.OperationStatus);

            var operationAsset = operation.OperationAssets.FirstOrDefault(a => a.Asset.RelatedAgentId == agentId);
            if (operationAsset == null)
            {
                logger.LogDebug("No asset assigned to this agent in operation {OperationId}", operation.Id);
                continue;
            }

            foreach (var order in operation.Orders)
            {
                if (order.OrderStatus == OrderStatus.NotStarted || order.OrderType != OrderTypes.Attack || order.ResponsibleOperationAssetId != operationAsset.Id)
                {
                    logger.LogDebug("Skipping order {OrderId} — Type: {Type}, Status: {Status}",
                        order.Id, order.OrderType, order.OrderStatus);
                    continue;
                }

                logger.LogInformation("Executing order {OrderId} — Type: {Type}, Target: {Lat}/{Lon}",
                    order.Id, order.OrderType, order.TargetPointLatitude, order.TargetPointLongitude);

                await defenceGun.TakePosition(new Asset
                {
                    Id = order.TargetOperationAssetId ?? Guid.NewGuid(),
                    AssetType = AssetTypes.Aircraft,
                    Latitude = order.TargetPointLatitude,
                    Longitude = order.TargetPointLongitude,
                    Altitude = order.TargetPointAltitude,
                    Heading = order.TargetPointHeading,
                    Speed = order.TargetPointSpeed,
                });

                var continousAssetFeedResult = await openCmsClient.FeedAsset(agentState);
                if (!continousAssetFeedResult)
                {
                    logger.LogWarning("Failed to feed self asset to CMS");
                }

                await defenceGun.Fire();
            }
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
