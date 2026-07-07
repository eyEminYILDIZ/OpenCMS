using OpenCMS.CMS.Application.Assets.Self.Feed;

namespace OpenCMS.CMS.Application.Configurations.Interfaces;

public interface IClientSocketService
{
    Task AssetReceived(CommandResponse asset, CancellationToken cancellationToken = default);
}
