using Microsoft.Extensions.Configuration;

namespace OpenCMS.Agent.AutonomousDrone.Services;


public class OperationService
{
    private readonly string baseUrl;
    private readonly Guid agentId;
    private readonly HttpClient _httpClient;
    private readonly OpenCmsClient _openCmsClient;
    private readonly ILogger<OperationService> logger;

    public OperationService(IConfiguration configuration, OpenCmsClient openCmsClient, ILogger<OperationService> logger)
    {
        baseUrl = configuration["OpenCMS:BaseUrl"]!;
        agentId = Guid.Parse(configuration["Agent:AgentId"]!);
        _openCmsClient = openCmsClient;
        this.logger = logger;
    }

    public async Task<bool> Ping()
    {
        return await _openCmsClient.Ping();
    }

    public async Task<List<Waypoint>> GetActiveOperationWayPoints()
    {
        var activeOperations = await _openCmsClient.GetActiveOperations();
        logger.LogInformation("Received {Count} active operation(s)", activeOperations.Count);

        // detect operation
        OpenCMS.CMS.Application.Operations.Self.GetById.ResponseModel operation = null;
        OpenCMS.CMS.Application.Operations.Self.GetById.OperationAssetResponse operationAsset = null;
        foreach (var activeOperation in activeOperations)
        {
            operation = await _openCmsClient.GetOperation(activeOperation.Id);

            logger.LogInformation("Active operation {OperationId} — Name: {Name}, Type: {Type}, Status: {Status}",
                            operation.Id, operation.Name, operation.OperationType, operation.OperationStatus);

            operationAsset = operation.OperationAssets.FirstOrDefault(a => a.Asset.RelatedAgentId == agentId);
            if (operationAsset == null)
            {
                logger.LogDebug("No asset assigned to this agent in operation {OperationId}", operation.Id);
                continue;
            }

            if (operation != null)
                break;
        }

        // detect waypoints
        var waypoints = new List<Waypoint>();
        foreach (var order in operation.Orders)
        {
            if (order.OrderStatus == OrderStatus.NotStarted || order.ResponsibleOperationAssetId != operationAsset.Id)
            {
                logger.LogDebug("Skipping order {OrderId} — Type: {Type}, Status: {Status}",
                    order.Id, order.OrderType, order.OrderStatus);
                continue;
            }

            logger.LogInformation("Executing order {OrderId} — Type: {Type}, Target: {Lat}/{Lon}",
                order.Id, order.OrderType, order.TargetPointLatitude, order.TargetPointLongitude);

            var waypoint = new Waypoint(order.Code, order.TargetPointLatitude, order.TargetPointLongitude, order.TargetPointAltitude, order.TargetPointHeading, order.TargetPointSpeed, (OrderTypesContract)order.OrderType);
            waypoints.Add(waypoint);
        }
        return waypoints;
    }

}
