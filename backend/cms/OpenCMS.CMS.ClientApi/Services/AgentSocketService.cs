using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;

namespace OpenCMS.CMS.ClientApi.Services;

// use this file when ClientApi needs to access the agents directly.
public class AgentSocketService : IAgentSocketService
{
    // ClientApi does not use this, it created for surpassing the interface implement errror.
    public Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
