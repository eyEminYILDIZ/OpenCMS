using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;
using OpenCMS.CMS.ClientApi.Hubs;

namespace OpenCMS.CMS.ClientApi.Services;

// use this file when ClientApi needs to access the web clients directly.
public class ClientSocketService : IClientSocketService
{
    private readonly IHubContext<ClientHub> _hubContext;

    public ClientSocketService(IHubContext<ClientHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.All.SendAsync("UpdateAsset", asset, cancellationToken);
    }
}
