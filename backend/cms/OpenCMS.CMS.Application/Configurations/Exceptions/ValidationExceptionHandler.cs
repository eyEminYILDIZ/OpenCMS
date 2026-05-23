using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace OpenCMS.CMS.Application.Configurations.Exceptions;

public class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationException)
            return false;

        var response = ApiResponse.BadRequest(validationException.Errors);
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await context.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
