using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;

namespace OpenCMS.CMS.ClientApi.Services;

// Forwards dispatch create/update/delete events to AgentHub (hosted by AgentApi) over the
// outbound HubConnection owned by AgentSocketClient, so connected agents get notified.
public class AgentSocketService : IAgentSocketService
{
    private readonly AgentSocketClient _agentSocketClient;

    public AgentSocketService(AgentSocketClient agentSocketClient)
    {
        _agentSocketClient = agentSocketClient;
    }

    public async Task FeedAsset(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        // Assets/Feed is only mapped on AgentApi, so ClientApi never invokes this in practice.
        await Task.CompletedTask;
    }

    public async Task CreateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Create.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        var payload = new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            ProviderAgentName = dispatch.ProviderAgentName,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt,
            LastActionType = ActionTypes.Create,
        };
        await _agentSocketClient.SendDispatch(payload, cancellationToken);
    }

    public async Task UpdateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Update.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        var payload = new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            ProviderAgentName = dispatch.ProviderAgentName,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt,
            LastActionType = ActionTypes.Update
        };
        await _agentSocketClient.SendDispatch(payload, cancellationToken);
    }

    public async Task DeleteDispatch(OpenCMS.CMS.Application.Dispatches.Self.Delete.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        var payload = new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
        {
            Id = dispatch.Id,
            Title = dispatch.Title,
            Description = dispatch.Description,
            Category = dispatch.Category,
            OccuredAt = dispatch.OccuredAt,
            RelatedEntityId = dispatch.RelatedEntityId,
            RelatedChildEntityId = dispatch.RelatedChildEntityId,
            ProviderAgentId = dispatch.ProviderAgentId,
            ProviderAgentName = dispatch.ProviderAgentName,
            CreatedAt = dispatch.CreatedAt,
            UpdatedAt = dispatch.UpdatedAt,
            LastActionType = ActionTypes.Delete
        };
        await _agentSocketClient.SendDispatch(payload, cancellationToken);
    }
}
