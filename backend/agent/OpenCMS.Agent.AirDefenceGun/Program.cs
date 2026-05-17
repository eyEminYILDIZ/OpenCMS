// Setup OpenCMS client and agent state
var agentId = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e23");
var assetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24");
var baseUrl = "http://localhost:5010";
var openCmsClient = new OpenCmsClient(agentId, baseUrl);
var agentState = new AgentState(agentId, assetId, "Air Defence Gun Agent", AssetTypes.Vehicle, ThreatTypes.Own);
var defenceGun = new DefenceGun(agentState);
agentState.UpdateState(37.7749, 41.4199, 100, 205, 0);
var cancellationTokenSource = new CancellationTokenSource();

System.Console.WriteLine(">> AirDefenceGun agent is started.");
while (!cancellationTokenSource.Token.IsCancellationRequested)
{
    try
    {
        // 1 - Ping the OpenCMS server to check connectivity
        var agentPingResult = await openCmsClient.Ping();
        Console.WriteLine($"\nPing was: {(agentPingResult ? "Succeeded" : "Failed")}.");

        // 2 - Send self asset information to OpenCMS
        var selfAsset = agentState.GetSelfAsset();
        var selfAssetFeedResult = await openCmsClient.FeedAsset(selfAsset);
        Console.WriteLine($"Self Asset Feed was: {(selfAssetFeedResult ? "Succeeded" : "Failed")}.");

        var assignedOperations = await openCmsClient.GetActiveOperations();
        Console.WriteLine($"Received {assignedOperations.Count} active operation(s).");
        foreach (var operation in assignedOperations)
        {
            Console.WriteLine($">> Active Operation: {operation.Id}, Name: {operation.Name}, Type: {operation.OperationType}, Status: {operation.OperationStatus}");
            // Here you would implement logic to execute the operation, such as

            var operationAsset = operation.OperationAssets.FirstOrDefault(a => a.RelatedAgentId == agentId);
            if (operationAsset == null)
            {
                Console.WriteLine($">> No asset assigned to this agent in the operation.");
                continue;
            }

            foreach (var order in operation.Orders)
            {
                if (order.OrderStatus == OrderStatus.Passive || order.OrderType != OrderTypes.Attack || order.ResponsibleOperationAssetId != operationAsset.Id)
                {
                    System.Console.WriteLine($">> Skipping Order: {order.Id}, Type: {order.OrderType}, Status: {order.OrderStatus}, Responsible Asset: {order.ResponsibleOperationAssetId}");
                    continue;
                }

                Console.WriteLine($">> Active Order: {order.Id}, Type: {order.OrderType}, Status: {order.OrderStatus}, Target: {order.TargetPointLatitude}/{order.TargetPointLongitude}");

                // 3 - Simulate taking position and firing at a target
                await defenceGun.TakePosition(new Asset
                {
                    Id = order.TargetOperationAssetId ?? Guid.NewGuid(), // TODO: Get actual target asset ID if available, this is opeation asset not actual asset
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



        // 3 - Get assigned order from OpenCMS
        // var assignedOrders = await openCmsClient.GetAssignedOrders(agentId);
        // if (assignedOrders != null && assignedOrders.Count > 0)
        // {
        //     Console.WriteLine($"Received {assignedOrders.Count} assigned order(s).");
        //     foreach (var order in assignedOrders)            {
        //         Console.WriteLine($"Processing Order: {order.Id}, Type: {order.Type}, Target: {order.TargetAssetId}");
        //         // Here you would implement logic to execute the order, such as moving to a location, engaging a target, etc.
        //         // For this example, we will just print the order details and mark it as completed.
        //         var orderCompletionResult = await openCmsClient.MarkOrderCompleted(order.Id);
        //         Console.WriteLine($"Order {order.Id} marked as completed: {(orderCompletionResult ? "Success" : "Failed")}.");
        //     } 
        // }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }

    // Wait for a short period before polling for new inputs
    await Task.Delay(1000, cancellationTokenSource.Token);
}

System.Console.WriteLine(">> AirDefenceGun agent is shutting down.");