using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using OpenCMS.CMS.Application.Configurations;
using OpenCMS.CMS.Domain.Entities;

namespace OpenCMS.Libraries.ApiClient;

public class OpenCmsClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenCmsClient> _logger;
    private readonly bool _loggingEnabled = false;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public OpenCmsClient(Guid agentId, string baseUrl, HttpClient httpClient, ILogger<OpenCmsClient> logger, bool loggingEnabled = false)
    {
        _agentId = agentId;
        _baseUrl = baseUrl;
        _httpClient = httpClient;
        _logger = logger;
        _loggingEnabled = loggingEnabled;
    }

    public async Task<bool> Ping()
    {
        var body = new OpenCMS.CMS.Application.Agents.Self.Ping.Command() { Id = _agentId, SentAt = DateTime.UtcNow };
        var response = await _httpClient.PutAsJsonAsync($"{_baseUrl}/agents/{_agentId}/ping", body, _jsonOptions);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> FeedAsset(Asset asset)
    {
        if (_loggingEnabled)
        {
            _logger.LogDebug("Feeding asset {AssetId} ({AssetName})", asset.Id, asset.Name);
        }

        var command = new OpenCMS.CMS.Application.Assets.Self.Feed.Command()
        {
            Id = asset.Id,
            Name = asset.Name,
            Latitude = asset.Latitude,
            Longitude = asset.Longitude,
            Altitude = asset.Altitude,
            Heading = asset.Heading,
            Speed = asset.Speed,
            AssetType = asset.AssetType,
            ThreatType = asset.ThreatType,
            RelatedAgentId = asset.RelatedAgentId
        };
        var response = await _httpClient.PutAsJsonAsync($"{_baseUrl}/assets/{asset.Id}/feed", command, _jsonOptions);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to feed asset {AssetId}: {StatusCode}", asset.Id, response.StatusCode);
            _logger.LogError("Response: {Response}", await response.Content.ReadAsStringAsync());
        }

        return response.IsSuccessStatusCode;
    }

    public async Task<List<OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.QueryResponse>> GetActiveOperations()
    {
        var body = new OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.Query() { AgentId = _agentId };
        var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/operations/GetActivesByAgent", body, _jsonOptions);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to get active operations: {StatusCode}", response.StatusCode);
            throw new Exception($"Failed to get active operations: {response.StatusCode}");
        }
        var content = await response.Content.ReadAsStringAsync();
        var responseBody = JsonSerializer.Deserialize<ApiResponse>(content, _jsonOptions);
        if (responseBody == null || responseBody.Data == null || responseBody.Error != null)
        {
            _logger.LogError("Invalid response body: {Content}", string.Join(',', responseBody?.Error) ?? "invalid response body");
            throw new Exception("Error: " + responseBody?.Error ?? "invalid response body");
        }
        return JsonSerializer.Deserialize<List<OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.QueryResponse>>(responseBody.Data.ToString(), _jsonOptions);
    }

    public async Task<OpenCMS.CMS.Application.Operations.Self.GetById.ResponseModel> GetOperation(Guid operationId)
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/operations/{operationId}");
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to get operation {OperationId}: {StatusCode}", operationId, response.StatusCode);
            throw new Exception($"Failed to get operation {operationId}: {response.StatusCode}");
        }
        var content = await response.Content.ReadAsStringAsync();
        var responseBody = JsonSerializer.Deserialize<ApiResponse>(content, _jsonOptions);
        if (responseBody == null || responseBody.Data == null || responseBody.Error != null)
        {
            _logger.LogError("Invalid response body for operation {OperationId}: {Content}", operationId, string.Join(',', responseBody?.Error) ?? "invalid response body");
            throw new Exception("Error: " + responseBody?.Error ?? "invalid response body");
        }
        return JsonSerializer.Deserialize<OpenCMS.CMS.Application.Operations.Self.GetById.ResponseModel>(responseBody.Data.ToString(), _jsonOptions);
    }
}
