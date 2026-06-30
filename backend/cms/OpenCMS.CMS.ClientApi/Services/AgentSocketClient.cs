using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using OpenCMS.CMS.Application.Assets.Self.Feed;
using OpenCMS.CMS.Application.Configurations.Interfaces;
using OpenCMS.CMS.ClientApi.Hubs;

namespace OpenCMS.CMS.ClientApi.Services;

public class AgentSocketClient : BackgroundService
{
    private readonly HubConnection _connection;
    private readonly ILogger<AgentSocketClient> _logger;
    private readonly IHubContext<ClientHub> _clientHubContext;
    private readonly string _hubUrl;

    public AgentSocketClient(IConfiguration configuration, ILogger<AgentSocketClient> logger, IHubContext<ClientHub> clientHubContext)
    {
        _logger = logger;
        _clientHubContext = clientHubContext;
        _hubUrl = configuration["AgentApi:AgentHubUrl"] ?? "http://localhost:5010/hubs/agents";
        _connection = new HubConnectionBuilder()
            .WithUrl(_hubUrl)
            .WithAutomaticReconnect()
            .Build();

        _connection.Reconnecting += exception =>
        {
            _logger.LogWarning(exception, "Lost connection to AgentHub at {Url}, attempting to reconnect", _hubUrl);
            return Task.CompletedTask;
        };

        _connection.Reconnected += connectionId =>
        {
            _logger.LogInformation("Reconnected to AgentHub at {Url}", _hubUrl);
            return Task.CompletedTask;
        };

        _connection.Closed += exception =>
        {
            _logger.LogError(exception, "Connection to AgentHub at {Url} closed", _hubUrl);
            return Task.CompletedTask;
        };

        _connection.On<CommandResponse>("UpdateAsset", async (asset) =>
        {
            // _logger.LogInformation("Received asset update for asset {AssetId}", asset.AssetId);
            await _clientHubContext.Clients.All.SendAsync("UpdateAsset", asset);
        });
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Connecting to ClientApi AgentHub at {Url}", _hubUrl);
        await _connection.StartAsync(stoppingToken);
        _logger.LogInformation("Connected to ClientApi AgentHub at {Url}", _hubUrl);

        // Keep the service running until the host shuts down; WithAutomaticReconnect()
        // handles drops in the underlying connection.
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _connection.StopAsync(cancellationToken);
        await base.StopAsync(cancellationToken);
    }

    public override void Dispose()
    {
        _connection.DisposeAsync().AsTask().GetAwaiter().GetResult();
        base.Dispose();
        GC.SuppressFinalize(this);
    }
}
