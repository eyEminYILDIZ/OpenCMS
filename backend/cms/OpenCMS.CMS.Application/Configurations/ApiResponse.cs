namespace OpenCMS.CMS.Application.Configurations;

public record ApiResponse(int StatusCode, object? Data, string[]? Error)
{
    public static ApiResponse Ok(object data) =>
        new(200, data, null);

    public static ApiResponse NotFound(string message) =>
        new(404, null, [message]);

    public static ApiResponse BadRequest(IReadOnlyDictionary<string, string[]> errors) =>
        new(400, null, errors.SelectMany(e => e.Value).ToArray());
}
