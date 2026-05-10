using System.Net.Http.Json;

namespace OpenCMS.Agent.Library;

public class InputClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    public InputClient(Guid agentId, string baseUrl)
    {
        _agentId = agentId;
        _baseUrl = baseUrl;
    }

    public async Task<bool> Ping()
    {
        var httpClient = new HttpClient();
        var body = new { AgentId = _agentId, SentAt = DateTime.UtcNow };
        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/agents/{_agentId}/ping", body);
        return response.IsSuccessStatusCode;
    }
}
