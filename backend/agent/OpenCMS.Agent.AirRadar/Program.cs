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
var logger = loggerFactory.CreateLogger("AirRadar");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>());
var radar = new Radar();
var agentState = new AgentState(agentId, assetId, "Air Radar Agent", AssetTypes.Vehicle, ThreatTypes.Own);
agentState.UpdateState(41.4194, 37.7749, 100, 205, 0);

var cts = new CancellationTokenSource();

logger.LogInformation("Air Radar agent started");
while (!cts.Token.IsCancellationRequested)
{
    try
    {
        var pingResult = await openCmsClient.Ping();
        logger.LogInformation("Ping {Result}", pingResult ? "succeeded" : "failed");

        var selfAsset = agentState.GetSelfAsset();
        var selfFeedResult = await openCmsClient.FeedAsset(selfAsset);
        logger.LogInformation("Self asset feed {Result}", selfFeedResult ? "succeeded" : "failed");

        var aircrafts = await radar.Scan();
        foreach (var aircraft in aircrafts)
        {
            var feedResult = await openCmsClient.FeedAsset(new Asset
            {
                Id = aircraft.Id,
                Name = aircraft.Callsign,
                Latitude = aircraft.Latitude,
                Longitude = aircraft.Longitude,
                Altitude = aircraft.Altitude,
                Heading = aircraft.Heading,
                Speed = aircraft.Speed,
                AssetType = AssetTypes.Vehicle,
                ThreatType = ThreatTypes.Own
            });
            logger.LogInformation("Asset feed for {AssetId} ({Callsign}) {Result}",
                aircraft.Id, aircraft.Callsign, feedResult ? "succeeded" : "failed");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error in agent loop");
    }

    await Task.Delay(5000, cts.Token);
}

logger.LogInformation("Air Radar agent shutting down");
await host.StopAsync();
