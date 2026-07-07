using Microsoft.AspNetCore.SignalR;
using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;

namespace OpenCMS.CMS.ClientApi.Services;

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// ATTENTION /////////////////////////////////////////////////
// FAKE CLASS, CREAED FOR SURPASSING THE INTERFACE IMPLEMENTATION ERROR. DO NOT USE THIS CLASS. //
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

public class AgentSocketService : IAgentSocketService
{

    public AgentSocketService()
    {
    }

    public async Task FeedAsset(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
    }



    public async Task CreateDispatch(Application.Dispatches.Self.Create.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
    }

    public async Task DeleteDispatch(Application.Dispatches.Self.Delete.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateDispatch(Application.Dispatches.Self.Update.CommandResponse dispatch, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
    }
}
