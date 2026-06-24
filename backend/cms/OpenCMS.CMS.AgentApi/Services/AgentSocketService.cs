using Microsoft.AspNetCore.SignalR.Client;
using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;

namespace OpenCMS.CMS.AgentApi.Services;

public class AgentSocketService : IAgentSocketService, IAsyncDisposable
{
    private readonly HubConnection _connection;
    private readonly ILogger<AgentSocketService> _logger;
    private readonly string _hubUrl;

    public AgentSocketService(IConfiguration configuration, ILogger<AgentSocketService> logger)
    {
        _logger = logger;
        _hubUrl = configuration["ClientApi:AgentHubUrl"] ?? "http://localhost:5020/hubs/agents";
        _connection = new HubConnectionBuilder()
            .WithUrl(_hubUrl)
            .WithAutomaticReconnect()
            .Build();
    }

    public async Task AssetUpdated(CommandResponse asset, CancellationToken cancellationToken = default)
    {
        await EnsureConnectedAsync(cancellationToken);
        await _connection.InvokeAsync("SendAssetUpdate", asset, cancellationToken);
    }

    private async Task EnsureConnectedAsync(CancellationToken cancellationToken)
    {
        if (_connection.State == HubConnectionState.Disconnected)
        {
            _logger.LogInformation("Connecting to ClientApi AgentHub at {Url}", _hubUrl);
            await _connection.StartAsync(cancellationToken);
        }
    }

    public async ValueTask DisposeAsync()
    {
        await _connection.DisposeAsync();
    }
}
