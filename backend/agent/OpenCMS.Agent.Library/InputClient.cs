using System.Net.Http.Json;

namespace OpenCMS.Agent.Library;

public class InputClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    private readonly HttpClient httpClient = new HttpClient();
    public InputClient(Guid agentId, string baseUrl)
    {
        _agentId = agentId;
        _baseUrl = baseUrl;
    }

    public async Task<bool> Ping()
    {
        var body = new { agentId = _agentId, sentAt = DateTime.UtcNow };
        var response = await httpClient.PutAsJsonAsync($"{_baseUrl}/agents/{_agentId}/ping", body);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> FeedAsset(Guid assetId,
                                        string name,
                                        double latitude,
                                        double longitude,
                                        double altitude,
                                        double heading,
                                        double speed,
                                        int assetType,
                                        int threatType)
    {
        var body = new { assetId, name, latitude, longitude, altitude, heading, speed, assetType, threatType };
        var response = await httpClient.PutAsJsonAsync($"{_baseUrl}/assets/{assetId}/feed", body);
        return response.IsSuccessStatusCode;
    }
}
