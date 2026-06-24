using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.Application.Configurations.Interfaces;

public interface IAgentSocketService
{
    Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default);
}
