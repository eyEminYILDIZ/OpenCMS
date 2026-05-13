using System.Net.Http.Json;
using System.Text.Json;
using OpenCMS.Agent.Library.Models;

namespace OpenCMS.Agent.Library;

public class OpenCmsClient
{
    private readonly Guid _agentId;
    private readonly string _baseUrl;
    private readonly HttpClient httpClient = new HttpClient();
    private readonly JsonSerializerOptions jsonOptions = new JsonSerializerOptions { };
    public OpenCmsClient(Guid agentId, string baseUrl)
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

    public async Task<bool> FeedAsset(AssetContract asset)
    {
        System.Console.WriteLine($">> Feeding asset: {asset}");
        var response = await httpClient.PutAsJsonAsync($"{_baseUrl}/assets/{asset.Id}/feed", asset);
        return response.IsSuccessStatusCode;
    }

    // public async Task<OrderContract> GetAssignedOrders()
    // {
    //     var response = await httpClient.GetAsync($"{_baseUrl}/agents/{_agentId}/assigned-order");
    //     if (response.IsSuccessStatusCode)
    //     {
    //         var content = await response.Content.ReadAsStringAsync();
    //         var order = JsonSerializer.Deserialize<OrderContract>(content, jsonOptions);
    //         return order;
    //     }
    //     return null;
    // }
}
