using Microsoft.AspNetCore.SignalR;

namespace OpenCMS.CMS.AgentApi.Hubs;

// All agent client will be connect this and listen events.
public class AgentHub : Hub
{
    public AgentHub()
    {
    }

    // agent client (ClientAPI project) will call these methods.
    // example; webapp sends a dispatch create/update/delete, and mobileapp will take this update.
    public async Task SendDispatch(OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse dispatch)
    {
        await Clients.All.SendAsync("DispatchReceived", dispatch);
    }
}
