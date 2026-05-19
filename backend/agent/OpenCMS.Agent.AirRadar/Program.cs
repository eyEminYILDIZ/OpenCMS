using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenCMS.ServiceDefaults;

var builder = Host.CreateApplicationBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddHttpClient();

var host = builder.Build();
await host.StartAsync();

var loggerFactory = host.Services.GetRequiredService<ILoggerFactory>();
var httpClientFactory = host.Services.GetRequiredService<IHttpClientFactory>();
var logger = loggerFactory.CreateLogger("AirRadar");

var agentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
var assetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23");
var baseUrl = "http://localhost:5010";

var openCmsClient = new OpenCmsClient(agentId, baseUrl, httpClientFactory.CreateClient(), loggerFactory.CreateLogger<OpenCmsClient>());
var radar = new Radar();
var agentState = new AgentState(agentId, assetId, "Air Radar Agent", AssetTypes.Vehicle, ThreatTypes.Own);
agentState.UpdateState(37.7749, 41.4194, 100, 205, 0);

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

    await Task.Delay(1000, cts.Token);
}

logger.LogInformation("Air Radar agent shutting down");
await host.StopAsync();
