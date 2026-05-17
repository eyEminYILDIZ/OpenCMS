using System.Net.Http.Json;
using System.Text.Json;
using OpenCMS.CMS.Domain.Entities;

namespace OpenCMS.Agent.Library;

public class OpenCmsClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    private readonly HttpClient httpClient = new HttpClient();
    private readonly JsonSerializerOptions jsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    public OpenCmsClient(Guid agentId, string baseUrl)
    {
        _agentId = agentId;
        _baseUrl = baseUrl;
    }

    public async Task<bool> Ping()
    {
        var body = new OpenCMS.CMS.Application.Agents.Self.Ping.Command() { Id = _agentId, SentAt = DateTime.UtcNow };
        var response = await httpClient.PutAsJsonAsync($"{_baseUrl}/agents/{_agentId}/ping", body, jsonOptions);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> FeedAsset(Asset asset)
    {
        System.Console.WriteLine($">> Feeding asset: {asset}");
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
        var response = await httpClient.PutAsJsonAsync($"{_baseUrl}/assets/{asset.Id}/feed", command, jsonOptions);
        return response.IsSuccessStatusCode;
    }

    public async Task<List<OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.QueryResponse>> GetActiveOperations()
    {
        var body = new OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.Query() { AgentId = _agentId };
        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/operations/GetActivesByAgent", body, jsonOptions);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to get active operations: {response.StatusCode}");
        }
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<OpenCMS.CMS.Application.Operations.Self.GetActivesByAgent.QueryResponse>>(content, jsonOptions);
    }
}
