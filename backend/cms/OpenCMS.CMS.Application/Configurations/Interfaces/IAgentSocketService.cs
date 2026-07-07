namespace OpenCMS.CMS.Application.Configurations.Interfaces;

public interface IAgentSocketService
{
    Task FeedAsset(OpenCMS.CMS.Application.Assets.Self.Feed.CommandResponse asset, CancellationToken cancellationToken = default);

    Task CreateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Create.CommandResponse dispatch, CancellationToken cancellationToken = default);
    Task UpdateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Update.CommandResponse dispatch, CancellationToken cancellationToken = default);
    Task DeleteDispatch(OpenCMS.CMS.Application.Dispatches.Self.Delete.CommandResponse dispatch, CancellationToken cancellationToken = default);
}
