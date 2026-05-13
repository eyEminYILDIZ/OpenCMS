// Setup OpenCMS client and agent state
var agentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
var baseUrl = "http://localhost:5010";
var openCmsClient = new OpenCmsClient(agentId, baseUrl);
var radar = new Radar();
var agentState = new AgentState(agentId, "Air Radar Agent", AssetTypesContract.Vehicle, ThreatTypesContract.Own);
agentState.UpdateState(37.7749, 41.4194, 100, 205, 0);
var cancellationTokenSource = new CancellationTokenSource();

System.Console.WriteLine(">> Air Radar agent is started.");
while (!cancellationTokenSource.Token.IsCancellationRequested)
{
    try
    {
        // 1 - Ping the OpenCMS server to check connectivity
        var agentPingResult = await openCmsClient.Ping();
        Console.WriteLine($"Ping was: {(agentPingResult ? "Succeeded" : "Failed")}.");

        // 2 - Send self asset information to OpenCMS
        var selfAsset = agentState.GetSelfAsset();
        var selfAssetFeedResult = await openCmsClient.FeedAsset(selfAsset);
        Console.WriteLine($"Self Asset Feed was: {(selfAssetFeedResult ? "Succeeded" : "Failed")}.");

        // 3 - Send radar scan results to OpenCMS
        var aircrafts = await radar.Scan();
        foreach (var aircraft in aircrafts)
        {
            var assetFeedResult = await openCmsClient.FeedAsset(new AssetContract()
            {
                Id = aircraft.Id,
                Name = aircraft.Callsign,
                Latitude = aircraft.Latitude,
                Longitude = aircraft.Longitude,
                Altitude = aircraft.Altitude,
                Heading = aircraft.Heading,
                Speed = aircraft.Speed,
                AssetType = AssetTypesContract.Vehicle,
                ThreatType = ThreatTypesContract.Own
            });
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