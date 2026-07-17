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
var logger = loggerFactory.CreateLogger("AirRadar");

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>());
var agentState = new AgentState(agentId, assetId, agentName, AssetTypesContract.Radar, ThreatTypesContract.Own);
var radar = new Radar();
agentState.UpdateState(latitude, longitude, altitude, heading, speed);

var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) =>
{
    e.Cancel = true;
    cts.Cancel();
};

logger.LogInformation("Air Radar agent started");
while (!cts.Token.IsCancellationRequested)
{
    try
    {
        var pingResult = await openCmsClient.Ping();
        logger.LogInformation("Ping {Result}", pingResult ? "succeeded" : "failed");

        var selfFeedResult = await openCmsClient.FeedAsset(agentState);
        logger.LogInformation("Self asset feed {Result}", selfFeedResult ? "succeeded" : "failed");

        var aircrafts = await radar.Scan();
        foreach (var aircraft in aircrafts)
        {
            var feedResult = await openCmsClient.FeedAsset(new AgentState()
            {
                Id = aircraft.Id,
                Name = aircraft.Callsign,
                Latitude = aircraft.Latitude,
                Longitude = aircraft.Longitude,
                Altitude = aircraft.Altitude,
                Heading = aircraft.Heading,
                Speed = aircraft.Speed,
                AssetType = AssetTypesContract.Aircraft,
                ThreatType = ThreatTypesContract.Hostile
            });
            logger.LogInformation("Asset feed for {AssetId} ({Callsign}) {Result}",
                aircraft.Id, aircraft.Callsign, feedResult ? "succeeded" : "failed");
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

    await Task.Delay(500, cts.Token).ConfigureAwait(false);
}

logger.LogInformation("Air Radar agent shutting down");
await host.StopAsync();
