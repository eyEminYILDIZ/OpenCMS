using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using OpenCMS.CMS.ClientApi.Hubs;

namespace OpenCMS.CMS.ClientApi.Services;

public class AgentSocketClient : BackgroundService
{
    private static readonly TimeSpan[] ReconnectDelays =
    {
        TimeSpan.FromSeconds(1),
        TimeSpan.FromSeconds(2),
        TimeSpan.FromSeconds(5),
        TimeSpan.FromSeconds(10),
        TimeSpan.FromSeconds(20),
        TimeSpan.FromSeconds(30),
    };

    private static readonly TimeSpan MaxInitialConnectDelay = TimeSpan.FromSeconds(30);

    private readonly HubConnection _connection;
    private readonly ILogger<AgentSocketClient> _logger;
    private readonly IHubContext<ClientHub> _clientHubContext;
    private readonly string _hubUrl;
    private volatile bool _stopping;

    public AgentSocketClient(IConfiguration configuration, ILogger<AgentSocketClient> logger, IHubContext<ClientHub> clientHubContext)
    {
        _logger = logger;
        _clientHubContext = clientHubContext;
        _hubUrl = configuration["AgentApi:AgentHubUrl"] ?? "http://localhost:5010/hubs/agents";
        _connection = new HubConnectionBuilder()
            .WithUrl(_hubUrl)
            .WithAutomaticReconnect(new ExponentialBackoffRetryPolicy())
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

        _connection.Closed += async exception =>
        {
            if (_stopping)
            {
                return;
            }

            _logger.LogError(exception, "Connection to AgentHub at {Url} closed; will retry with backoff", _hubUrl);
            await ConnectWithBackoffAsync(CancellationToken.None);
        };

        _connection.On<OpenCMS.CMS.Application.Assets.Self.Feed.CommandResponse>("AssetReceived", async (asset) =>
        {
            // _logger.LogInformation("Received asset update for asset {AssetId}", asset.AssetId);
            await _clientHubContext.Clients.All.SendAsync("AssetReceived", asset);
        });

        _connection.On<OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse>("DispatchReceived", async (dispatch) =>
        {
            await _clientHubContext.Clients.All.SendAsync("DispatchReceived", dispatch);
        });
    }

    public async Task SendDispatch(OpenCMS.CMS.Application.Dispatches.Self.ListAll.QueryResponse dispatch, CancellationToken cancellationToken = default)
    {
        if (_connection.State != HubConnectionState.Connected)
        {
            _logger.LogWarning("Cannot invoke {Method} on AgentHub at {Url}; connection state is {State}", "SendDispatch", _hubUrl, _connection.State);
            return;
        }

        await _connection.InvokeAsync("SendDispatch", dispatch, cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Never let a failed/dropped connection to the AgentHub take the host down;
        // keep retrying in the background with exponential backoff instead.
        await ConnectWithBackoffAsync(stoppingToken);

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task ConnectWithBackoffAsync(CancellationToken stoppingToken)
    {
        var attempt = 0;
        while (!stoppingToken.IsCancellationRequested && !_stopping)
        {
            try
            {
                _logger.LogInformation("Connecting to ClientApi AgentHub at {Url}", _hubUrl);
                await _connection.StartAsync(stoppingToken);
                _logger.LogInformation("Connected to ClientApi AgentHub at {Url}", _hubUrl);
                return;
            }
            catch (OperationCanceledException)
            {
                return;
            }
            catch (Exception ex)
            {
                var delay = ReconnectDelays[Math.Min(attempt, ReconnectDelays.Length - 1)];
                if (delay > MaxInitialConnectDelay)
                {
                    delay = MaxInitialConnectDelay;
                }

                _logger.LogWarning(ex, "Failed to connect to AgentHub at {Url}; retrying in {Delay}", _hubUrl, delay);
                attempt++;

                try
                {
                    await Task.Delay(delay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    return;
                }
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _stopping = true;
        await _connection.StopAsync(cancellationToken);
        await base.StopAsync(cancellationToken);
    }

    public override void Dispose()
    {
        _stopping = true;
        _connection.DisposeAsync().AsTask().GetAwaiter().GetResult();
        base.Dispose();
        GC.SuppressFinalize(this);
    }

    private sealed class ExponentialBackoffRetryPolicy : IRetryPolicy
    {
        public TimeSpan? NextRetryDelay(RetryContext retryContext)
        {
            var index = Math.Min(retryContext.PreviousRetryCount, ReconnectDelays.Length - 1);
            return ReconnectDelays[index];
        }
    }
}
