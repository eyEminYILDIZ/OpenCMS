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
var logger = loggerFactory.CreateLogger("AirDefenceGun");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>());
var agentState = new AgentState(agentId, assetId, "Air Defence Gun Agent", AssetTypes.Vehicle, ThreatTypes.Own);
var defenceGun = new DefenceGun(agentState, loggerFactory.CreateLogger<DefenceGun>());
agentState.UpdateState(37.7749, 41.4199, 100, 205, 0);

var cts = new CancellationTokenSource();

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

        foreach (var operation in activeOperations)
        {
            logger.LogInformation("Active operation {OperationId} — Name: {Name}, Type: {Type}, Status: {Status}",
                operation.Id, operation.Name, operation.OperationType, operation.OperationStatus);

            var operationAsset = operation.OperationAssets.FirstOrDefault(a => a.RelatedAgentId == agentId);
            if (operationAsset == null)
            {
                logger.LogDebug("No asset assigned to this agent in operation {OperationId}", operation.Id);
                continue;
            }

            foreach (var order in operation.Orders)
            {
                if (order.OrderStatus == OrderStatus.Passive || order.OrderType != OrderTypes.Attack || order.ResponsibleOperationAssetId != operationAsset.Id)
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
                await defenceGun.Fire();
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error in agent loop");
    }

    await Task.Delay(1000, cts.Token);
}

logger.LogInformation("Air Defence Gun agent shutting down");
await host.StopAsync();
