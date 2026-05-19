using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using OpenCMS.CMS.Domain.Entities;

namespace OpenCMS.Agent.Library;

public class OpenCmsClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenCmsClient> _logger;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public OpenCmsClient(Guid agentId, string baseUrl, HttpClient httpClient, ILogger<OpenCmsClient> logger)
    {
        _agentId = agentId;
        _baseUrl = baseUrl;
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> Ping()
    {
        var body = new OpenCMS.CMS.Application.Agents.Self.Ping.Command() { Id = _agentId, SentAt = DateTime.UtcNow };
        var response = await _httpClient.PutAsJsonAsync($"{_baseUrl}/agents/{_agentId}/ping", body, _jsonOptions);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> FeedAsset(Asset asset)
    {
        _logger.LogDebug("Feeding asset {AssetId} ({AssetName})", asset.Id, asset.Name);
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
        return JsonSerializer.Deserialize<List<OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.QueryResponse>>(content, _jsonOptions)!;
    }
}
