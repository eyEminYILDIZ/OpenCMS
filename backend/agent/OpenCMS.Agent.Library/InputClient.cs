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
}
