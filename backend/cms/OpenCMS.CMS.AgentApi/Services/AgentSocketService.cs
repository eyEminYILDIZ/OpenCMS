using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.AgentApi.Hubs;
using OpenCMS.CMS.Domain.Models;

namespace OpenCMS.CMS.AgentApi.Services;

// use this file when ClientApi needs to access the agents directly.
public class AgentSocketService : IAgentSocketService
{
    private readonly IHubContext<AgentHub> _hubContext;

    public AgentSocketService(IHubContext<AgentHub> hubContext)
    {
        _hubContext = hubContext;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// ASSET ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public async Task FeedAsset(OpenCMS.CMS.Application.Assets.Self.Feed.CommandResponse asset, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.All.SendAsync("AssetReceived", asset, cancellationToken);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// DISPATCH ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async Task SendDispatch(OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse dispatch, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.All.SendAsync("DispatchReceived", dispatch, cancellationToken);
    }

    // agent related endpoints will call this method.
    // example; mobileapp sends dispatch update, and webapp will take this update.
    public async Task CreateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Create.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await this.SendDispatch(new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
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
        }, cancellationToken);
    }

    public async Task UpdateDispatch(OpenCMS.CMS.Application.Dispatches.Self.Update.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await this.SendDispatch(new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
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
        }, cancellationToken);
    }

    public async Task DeleteDispatch(OpenCMS.CMS.Application.Dispatches.Self.Delete.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await this.SendDispatch(new OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse
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
        }, cancellationToken);
    }

}
