using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.AgentApi.Hubs;
using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;

namespace OpenCMS.CMS.AgentApi.Services;

// use this file when ClientApi needs to access the agents directly.
public class AgentSocketService : IAgentSocketService
{
    private readonly IHubContext<AgentHub> _hubContext;

    public AgentSocketService(IHubContext<AgentHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.All.SendAsync("UpdateAsset", asset, cancellationToken);
    }
}
