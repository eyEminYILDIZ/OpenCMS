# Data Model: Unified API Response Structure

**Phase**: 1 | **Date**: 2026-05-23

## New Type: ApiResponse

**File**: `backend/cms/OpenCMS.CMS.Application/Configurations/ApiResponse.cs`
**Namespace**: `OpenCMS.CMS.Application.Configurations`

### Properties

| Property | Type | Nullable | Description |
|----------|------|----------|-------------|
| `StatusCode` | `int` | No | Mirrors the HTTP response status code |
| `Data` | `object?` | Yes | Success payload — single object or array; `null` on failure |
| `Error` | `string[]?` | Yes | Flat array of error message strings; `null` on success; never a plain string or object |

### Factory Methods

| Method | Returns | HTTP Status | Data | Error |
|--------|---------|-------------|------|-------|
| `Ok(object data)` | `ApiResponse` | 200 | payload | `null` |
| `NotFound(string message)` | `ApiResponse` | 404 | `null` | `[message]` — single-element array |
| `BadRequest(IReadOnlyDictionary<string, string[]> errors)` | `ApiResponse` | 400 | `null` | all values from the dictionary flattened into one `string[]` |

### Invariants

- `Data` and `Error` are mutually exclusive: one is always `null`.
- `Error`, when not `null`, is always `string[]` — never a plain string, never an object. Clients can always iterate it without type inspection.
- `StatusCode` matches the HTTP response status line written by the endpoint or exception handler.

## Modified Type: ValidationExceptionHandler

**File**: `backend/cms/OpenCMS.CMS.Application/Configurations/Exceptions/ValidationExceptionHandler.cs`

**Change**: Replace `ValidationProblemDetails` write with `ApiResponse.BadRequest(errors)` write. Set `context.Response.StatusCode = 400` (already done). The `Errors` dictionary from `ValidationException` is passed to `ApiResponse.BadRequest`, which flattens all values into a single `string[]` for the `Error` field.

## Endpoint Pattern Changes

All endpoint lambdas change from:

```text
var result = await mediator.Send(...);
return result;
```

To one of:

```text
// Non-nullable result
var result = await mediator.Send(...);
return TypedResults.Json(ApiResponse.Ok(result), statusCode: 200);

// Nullable result
var result = await mediator.Send(...);
return result is null
    ? TypedResults.Json(ApiResponse.NotFound("Resource not found."), statusCode: 404)
    : TypedResults.Json(ApiResponse.Ok(result), statusCode: 200);
```

`TypedResults.Json` is used solely to set the HTTP status code on the response line to match the envelope's `StatusCode` field. It is a low-level serialization helper, not a semantic `Results.*` shortcut, and is consistent with the spirit of constitution B-II.
