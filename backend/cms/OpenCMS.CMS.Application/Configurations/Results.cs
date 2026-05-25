namespace OpenCMS.CMS.Application.Configurations;

public record Error(string Code)
{
    public static Error NotFound   => new("NOT_FOUND");
    public static Error Conflict   => new("CONFLICT");
    public static Error Validation => new("VALIDATION");
    public static Error Unexpected => new("UNEXPECTED");
}

public sealed class Result<T>
{
    public T?     Value     { get; }
    public Error? Error     { get; }
    public bool   IsSuccess => Error is null;

    private Result(T value)     => Value = value;
    private Result(Error error) => Error = error;

    public static Result<T> Success(T value)     => new(value);
    public static Result<T> Failure(Error error) => new(error);

    public static implicit operator Result<T>(T value)     => Success(value);
    public static implicit operator Result<T>(Error error) => Failure(error);
}

public sealed class Result
{
    public Error? Error     { get; }
    public bool   IsSuccess => Error is null;

    private Result()            { }
    private Result(Error error) => Error = error;

    public static Result Success()             => new();
    public static Result Failure(Error error)  => new(error);

    public static implicit operator Result(Error error) => Failure(error);
}

public static class ResultExtensions
{
    public static IResult ToHttpResult<T>(this Result<T> result) =>
        result.IsSuccess
            ? TypedResults.Json(ApiResponse.Ok(result.Value!), statusCode: 200)
            : result.Error!.ToHttpResult();

    public static IResult ToHttpResult(this Result result) =>
        result.IsSuccess
            ? TypedResults.Json(ApiResponse.Ok(null), statusCode: 200)
            : result.Error!.ToHttpResult();

    private static IResult ToHttpResult(this Error error) =>
        error.Code switch
        {
            "NOT_FOUND"  => TypedResults.Json(ApiResponse.NotFound(error.Code),        statusCode: 404),
            "CONFLICT"   => TypedResults.Json(new ApiResponse(409, null, [error.Code]), statusCode: 409),
            "VALIDATION" => TypedResults.Json(new ApiResponse(400, null, [error.Code]), statusCode: 400),
            _            => TypedResults.Json(new ApiResponse(500, null, [error.Code]), statusCode: 500),
        };
}
