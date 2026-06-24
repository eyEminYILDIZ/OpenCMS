using Microsoft.AspNetCore.SignalR;

namespace OpenCMS.CMS.ClientApi.Hubs;

// Web clients will connect this hub and call these events
public class ClientHub : Hub
{
    // there is not any method that web clients will call via websocket
}
