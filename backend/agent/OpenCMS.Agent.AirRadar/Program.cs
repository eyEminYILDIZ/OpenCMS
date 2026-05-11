using OpenCMS.Agent.AirRadar;
using OpenCMS.Agent.Library;

var agentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
var baseUrl = "http://localhost:5010";
var openCmsClient = new OpenCmsClient(agentId, baseUrl);

var radar = new Radar();

System.Console.WriteLine(">> AirRadar agent is started.");

var cancellationTokenSource = new CancellationTokenSource();
while (!cancellationTokenSource.Token.IsCancellationRequested)
{
    try
    {
        var agentPingResult = await openCmsClient.Ping();
        Console.WriteLine($"Ping was: {(agentPingResult ? "Succeeded" : "Failed")}.");

        var aircrafts = await radar.Scan();
        foreach (var aircraft in aircrafts)
        {
            var assetFeedResult = await openCmsClient.FeedAsset(
                assetId: aircraft.Id,
                name: aircraft.Callsign,
                latitude: aircraft.Latitude,
                longitude: aircraft.Longitude,
                altitude: aircraft.Altitude,
                heading: aircraft.Heading,
                speed: aircraft.Speed,
                assetType: 0,
                threatType: 0
            );
            Console.WriteLine($"Asset Feed for {aircraft.Id} was: {(assetFeedResult ? "Succeeded" : "Failed")}.");
        }

    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }

    // Wait for a short period before polling for new inputs
    await Task.Delay(2000, cancellationTokenSource.Token);
}

System.Console.WriteLine(">> AirRadar agent is shutting down.");