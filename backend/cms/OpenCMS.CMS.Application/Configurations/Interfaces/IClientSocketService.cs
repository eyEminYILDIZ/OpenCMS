using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.Application.Configurations.Interfaces;

public interface IClientSocketService
{
    Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default);
}
