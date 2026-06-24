using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.ClientApi.Hubs;

// AgentApi will connect this hub and call these events
public class AgentHub : Hub
{
    private readonly IHubContext<ClientHub> _clientHubContext;

    public AgentHub(IHubContext<ClientHub> clientHubContext)
    {
        _clientHubContext = clientHubContext;
    }

    // agent will call this.
    public async Task SendAssetUpdate(CommandResponse asset)
    {
        // Forward the asset update to all connected web clients
        await _clientHubContext.Clients.All.SendAsync("UpdateAsset", asset);
    }
}
