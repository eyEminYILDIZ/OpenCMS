// Setup OpenCMS client and agent state
var agentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
var baseUrl = "http://localhost:5010";
var openCmsClient = new OpenCmsClient(agentId, baseUrl);
var agentState = new AgentState(agentId, "Air Defence Gun Agent", AssetTypesContract.Vehicle, ThreatTypesContract.Own);
agentState.UpdateState(37.7749, 41.4199, 100, 205, 0);
var cancellationTokenSource = new CancellationTokenSource();

System.Console.WriteLine(">> AirDefenceGun agent is started.");
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
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }

    // Wait for a short period before polling for new inputs
    await Task.Delay(2000, cancellationTokenSource.Token);
}

System.Console.WriteLine(">> AirDefenceGun agent is shutting down.");