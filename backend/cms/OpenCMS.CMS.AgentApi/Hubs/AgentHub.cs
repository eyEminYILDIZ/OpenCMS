using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.AgentApi.Hubs;

// All agent client will be connect this and listen events.
public class AgentHub : Hub
{
    public AgentHub()
    {
    }

    // agent client (ClientAPI project) will call this method.
    // example; webapp sends dispatch update, and mobileapp will take this update.
    public async Task UpdateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Create.CommandResponse dispatch)
    {
        await Clients.AllExcept(Context.ConnectionId).SendAsync("UpdateDispatch", dispatch);
    }
}
