using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.AgentApi.Hubs;

// All agent client will be connect this and listen events.
public class AgentHub : Hub
{
    public AgentHub()
    {
    }
}
