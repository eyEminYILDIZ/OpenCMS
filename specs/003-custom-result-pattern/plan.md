# Implementation Plan: Custom Result Pattern for Application Layer

**Branch**: `003-custom-result-pattern` | **Date**: 2026-05-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-custom-result-pattern/spec.md`

## Summary

Replace nullable handler return types (`T?`) with a custom `Result<T>` type that explicitly carries either a value or a structured `Error`. A single `Results.cs` file is added to `OpenCMS.CMS.Application/Configurations/` (already globally-imported namespace). Implicit operators allow handlers to return values or errors with no extra ceremony. All existing feature handlers and their endpoints are migrated.

## Technical Context

**Language/Version**: C# 13 / .NET 10

**Primary Dependencies**: MediatR (in-process messaging), FluentValidation (pipeline validation), ASP.NET Core Minimal APIs (endpoints)

**Storage**: SQLite via EF Core — unchanged by this feature

**Testing**: No dedicated test project exists yet; acceptance proof is a running API with migrated endpoints behaving correctly

**Target Platform**: Linux server (ASP.NET Core Kestrel)

**Project Type**: Web service (Vertical Slice Architecture)

**Performance Goals**: No change — this is a structural refactor with zero runtime overhead

**Constraints**: Zero new NuGet packages. `ApiResponse` JSON contract must remain identical to consumers.

**Scale/Scope**: Approximately 20 handler + endpoint pairs across Assets, Agents, and Operations features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — Simplicity First | PASS | One new file, no new abstractions beyond `Result<T>` and `Error`. Every added concept justifies itself. |
| II — Readable Code | PASS | Implicit operators make handler intent obvious: `return Error.NotFound(...)` reads as English. |
| III — SOLID | PASS | `Result<T>` has a single responsibility: represent an operation outcome. |
| B-I — VSA | PASS | `Results.cs` lives in `Configurations/` — the established home for cross-cutting application infrastructure. |
| B-II — CQRS | DEVIATION (justified) | Constitution says "Return `null` for not-found cases." This feature intentionally supersedes that rule — see Complexity Tracking. |
| B-II — no `Results.*` helpers | PASS | Our `Result<T>` is unrelated to `Microsoft.AspNetCore.Http.Results`. Endpoints continue to use `TypedResults.Json`. |
| B-III — Validation | PASS | `ValidationBehavior` pipeline continues to handle FluentValidation exceptions. `Result<T>` handles business-logic failures returned by handlers. |
| B-IV — Domain Model | PASS | No domain or entity changes. |
| B-V — API Contracts | PASS | External JSON shape of `ApiResponse` is unchanged. |

## Project Structure

### Documentation (this feature)

```text
specs/003-custom-result-pattern/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit-tasks)
```

### Source Code

```text
backend/cms/OpenCMS.CMS.Application/
├── Configurations/
│   ├── ApiResponse.cs                    (unchanged)
│   └── Results.cs                        ← NEW: Error, Result<T>, Result, extension methods
└── Features/
    ├── Assets/_Self/
    │   ├── GetById/   Handler.cs + Endpoint.cs   (migrate: QueryResponse? → Result<QueryResponse>)
    │   ├── Delete/    Handler.cs + Endpoint.cs   (migrate: CommandResponse? → Result<CommandResponse>)
    │   ├── Update/    Handler.cs + Endpoint.cs   (migrate: CommandResponse? → Result<CommandResponse>)
    │   ├── Create/    Handler.cs + Endpoint.cs   (migrate: CommandResponse → Result<CommandResponse>)
    │   └── ListAll/   Handler.cs + Endpoint.cs   (migrate: List<QueryResponse> → Result<List<QueryResponse>>)
    ├── Agents/_Self/
    │   ├── GetById/   Handler.cs + Endpoint.cs   (migrate)
    │   ├── Delete/    Handler.cs + Endpoint.cs   (migrate)
    │   ├── Update/    Handler.cs + Endpoint.cs   (migrate)
    │   ├── Create/    Handler.cs + Endpoint.cs   (migrate)
    │   ├── Ping/      Handler.cs + Endpoint.cs   (migrate)
    │   └── ListAll/   Handler.cs + Endpoint.cs   (migrate)
    └── Operations/
        ├── _Self/
        │   ├── GetById/             Handler.cs + Endpoint.cs   (migrate)
        │   ├── GetActivesByAgent/   Handler.cs + Endpoint.cs   (migrate)
        │   ├── Create/              Handler.cs + Endpoint.cs   (migrate)
        │   ├── Delete/              Handler.cs + Endpoint.cs   (migrate)
        │   └── ListAll/             Handler.cs + Endpoint.cs   (migrate)
        ├── OperationAssets/
        │   ├── Create/   Handler.cs + Endpoint.cs   (migrate)
        │   └── Delete/   Handler.cs + Endpoint.cs   (migrate)
        └── Orders/
            ├── Create/   Handler.cs + Endpoint.cs   (migrate)
            ├── Update/   Handler.cs + Endpoint.cs   (migrate)
            └── Delete/   Handler.cs + Endpoint.cs   (migrate)
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Supersedes constitution B-II rule "return null for not-found cases" | Null returns cannot carry an error code, message, or error category. Endpoints must guess the correct HTTP status from a null alone, which breaks as soon as more than one failure reason exists (e.g., forbidden vs. not found). | Keeping null returns: would require out-of-band conventions (magic strings, exceptions) to distinguish failure kinds — harder to read and harder to extend. |

---

## Phase 0: Research

*Findings consolidated from codebase analysis. No external research needed — all decisions are internal.*

### Decision 1: File placement

**Decision**: `Results.cs` in `OpenCMS.CMS.Application/Configurations/`

**Rationale**: `GlobalUsings.cs` already imports `OpenCMS.CMS.Application.Configurations` globally. Placing `Results.cs` there makes `Result<T>`, `Result`, and `Error` available everywhere in the Application project with zero additional using directives.

**Alternatives considered**: A separate `Common/` folder — rejected as unnecessary indirection for a single-file concern.

---

### Decision 2: Implicit operators

**Decision**: Both `Result<T>` and `Result` expose implicit conversion operators from `T` and from `Error`.

**Rationale**: With implicit operators, handlers read naturally:

```csharp
// Old (nullable return)
if (asset == null) return null;
return new QueryResponse { ... };

// New (Result<T> with implicit operators)
if (asset == null) return Error.NotFound("Asset not found.");
return new QueryResponse { ... };
```

No factory call noise (`Result<QueryResponse>.Success(...)`) pollutes handler bodies.

**Alternatives considered**: Explicit factory methods only (`Result<T>.Success(value)`) — rejected because the per-call verbosity adds no safety benefit over implicit operators given that `T` and `Error` are always distinct types.

---

### Decision 3: Error vocabulary

**Decision**: `Error` is a `record` with only `string Code`. No message field. Static factory properties provide the standard codes.

```csharp
public record Error(string Code)
{
    public static Error NotFound   => new("NOT_FOUND");
    public static Error Conflict   => new("CONFLICT");
    public static Error Validation => new("VALIDATION");
    public static Error Unexpected => new("UNEXPECTED");
}
```

**Rationale**: Error codes are machine-readable and sufficient for the API consumer to understand the failure. A free-text message field was removed because it adds no contract value — the code alone drives the HTTP status mapping and is self-describing. Keeping `Error` to a single field is the simplest possible shape.

**Alternatives considered**: `enum` for codes — rejected because adding a new code requires touching the enum definition; a string-based record requires only a new static property. `record` with `Message` field — removed per user decision: code alone is sufficient.

---

### Decision 4: HTTP status mapping

**Decision**: Extension methods on `Result<T>` and `Result` bridge to `TypedResults.Json(ApiResponse, statusCode)`. The mapping lives in `Results.cs`, co-located with the types. The error code is passed directly as the error string in `ApiResponse`.

```csharp
// Error code → HTTP status
"NOT_FOUND"   → 404  (ApiResponse.NotFound(error.Code))
"CONFLICT"    → 409  (new ApiResponse(409, null, [error.Code]))
"VALIDATION"  → 400  (new ApiResponse(400, null, [error.Code]))
anything else → 500  (new ApiResponse(500, null, [error.Code]))
success        → 200  (ApiResponse.Ok(value))
```

**Rationale**: Keeping the mapping in `Results.cs` means endpoints need only one call — `result.ToHttpResult()` — and the mapping is tested in one place. The error code is the sole error payload since `Error` no longer has a `Message` field.

**Alternatives considered**: Inline switch in each endpoint — rejected as it scatters the mapping across 20+ endpoints.

---

### Decision 5: Non-generic `Result` for void operations

**Decision**: Provide a non-generic `Result` type with only `IsSuccess`/`Error` for operations that succeed with no response body (e.g., fire-and-forget commands, or future void deletes).

**Rationale**: Existing delete handlers return the deleted entity in the response body (by current convention), so they use `Result<CommandResponse>`. The non-generic `Result` is included for completeness and future-proofing without adding complexity.

---

### Decision 6: Migration scope

**Decision**: All existing handlers that currently return `T?` are migrated. Handlers that already return a non-nullable `T` are also migrated to `Result<T>` for consistency, using the implicit operator — no handler logic changes required for those.

**Rationale**: Consistency across all slices is more valuable than a partial migration. With implicit operators, the cost per handler is one line change in the return type declaration and replacing null returns with `Error.NotFound(...)`.

---

## Phase 1: Design

See [data-model.md](data-model.md) for type design and [research.md](research.md) for decisions.

### `Results.cs` — Complete Type Design

```csharp
namespace OpenCMS.CMS.Application.Configurations;

// Error record — code only, no message field
public record Error(string Code)
{
    public static Error NotFound   => new("NOT_FOUND");
    public static Error Conflict   => new("CONFLICT");
    public static Error Validation => new("VALIDATION");
    public static Error Unexpected => new("UNEXPECTED");
}

// Generic result — for handlers that return a value
public sealed class Result<T>
{
    public T?     Value     { get; }
    public Error? Error     { get; }
    public bool   IsSuccess => Error is null;

    private Result(T value)     => Value = value;
    private Result(Error error) => Error = error;

    public static Result<T> Success(T value)     => new(value);
    public static Result<T> Failure(Error error) => new(error);

    // Implicit operators — allows: return value; and return Error.NotFound;
    public static implicit operator Result<T>(T value)    => Success(value);
    public static implicit operator Result<T>(Error error) => Failure(error);
}

// Non-generic result — for handlers that have no return value
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

// Extension methods — bridge Result → ApiResponse → IResult (HTTP)
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
```

### Handler Migration Pattern

**Before** (nullable):
```csharp
public class Handler : IRequestHandler<Query, QueryResponse?>
{
    public async Task<QueryResponse?> Handle(Query request, CancellationToken ct)
    {
        var asset = await _db.Assets.FirstOrDefaultAsync(a => a.Id == request.Id, ct);
        if (asset == null) return null;
        return new QueryResponse { ... };
    }
}
```

**After** (Result):
```csharp
public class Handler : IRequestHandler<Query, Result<QueryResponse>>
{
    public async Task<Result<QueryResponse>> Handle(Query request, CancellationToken ct)
    {
        var asset = await _db.Assets.FirstOrDefaultAsync(a => a.Id == request.Id, ct);
        if (asset == null) return Error.NotFound;
        return new QueryResponse { ... };
    }
}
```

### Endpoint Migration Pattern

**Before**:
```csharp
var asset = await mediator.Send(new Query { Id = id });
return asset is null
    ? TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)
    : TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200);
```

**After**:
```csharp
var result = await mediator.Send(new Query { Id = id });
return result.ToHttpResult();
```
