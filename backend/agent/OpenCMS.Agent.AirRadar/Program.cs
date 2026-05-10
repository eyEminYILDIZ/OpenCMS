using OpenCMS.Agent.Library;

var agentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
var baseUrl = "http://localhost:5010";
var inputClient = new InputClient(agentId, baseUrl);

System.Console.WriteLine(">> AirRadar agent is started.");

var cancellationTokenSource = new CancellationTokenSource();
while (!cancellationTokenSource.Token.IsCancellationRequested)
{
    try
    {
        var result = await inputClient.Ping();
        if (result)
        {
            Console.WriteLine("Ping successful.");
        }
        else
        {
            Console.WriteLine("Ping failed.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }

    // Wait for a short period before polling for new inputs
    await Task.Delay(5000, cancellationTokenSource.Token);
}

System.Console.WriteLine(">> AirRadar agent is shutting down.");