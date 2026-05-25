# Data Model: Custom Result Pattern

## Types

### `Error` (record)

| Field | Type | Notes |
|-------|------|-------|
| `Code` | `string` | Machine-readable: `NOT_FOUND`, `CONFLICT`, `VALIDATION`, `UNEXPECTED` |

No `Message` field — the code is the sole payload. Consumers map the code to a meaningful response.

**Static properties** (standard errors):
- `Error.NotFound`   → `new Error("NOT_FOUND")`
- `Error.Conflict`   → `new Error("CONFLICT")`
- `Error.Validation` → `new Error("VALIDATION")`
- `Error.Unexpected` → `new Error("UNEXPECTED")`

---

### `Result<T>` (sealed class)

| Member | Type | Notes |
|--------|------|-------|
| `Value` | `T?` | Populated when `IsSuccess = true` |
| `Error` | `Error?` | Populated when `IsSuccess = false` |
| `IsSuccess` | `bool` | `true` when `Error` is null |

**Implicit operators**:
- `T → Result<T>` (success path — enables `return value;` in handlers)
- `Error → Result<T>` (failure path — enables `return Error.NotFound;` in handlers)

---

### `Result` (sealed class, non-generic)

| Member | Type | Notes |
|--------|------|-------|
| `Error` | `Error?` | Populated when `IsSuccess = false` |
| `IsSuccess` | `bool` | `true` when `Error` is null |

**Implicit operators**:
- `Error → Result` (failure path — enables `return Error.NotFound;` in void handlers)

---

### `ResultExtensions` (static class)

| Method | Input | Returns | Notes |
|--------|-------|---------|-------|
| `ToHttpResult<T>()` | `Result<T>` | `IResult` | Maps success → 200, error code → status |
| `ToHttpResult()` | `Result` | `IResult` | Same for void operations |

**Error code → HTTP status mapping**:

| Code | Status | `ApiResponse` construction |
|------|--------|---------------------------|
| `NOT_FOUND` | 404 | `ApiResponse.NotFound(error.Code)` |
| `CONFLICT` | 409 | `new ApiResponse(409, null, [error.Code])` |
| `VALIDATION` | 400 | `new ApiResponse(400, null, [error.Code])` |
| anything else | 500 | `new ApiResponse(500, null, [error.Code])` |
| success | 200 | `ApiResponse.Ok(value)` |

## Relationships

```
Error ─────────────────────► Result<T>
  (implicit operator)              │
T ──────────────────────────► Result<T>
  (implicit operator)              │
                                   ▼
                          ResultExtensions.ToHttpResult()
                                   │
                                   ▼
                          TypedResults.Json(ApiResponse, statusCode)
```

## What Does NOT Change

- `ApiResponse` record — signature and factory methods are identical
- `ValidationBehavior` pipeline — continues to throw `ValidationException` for FluentValidation failures
- All `Command`, `Query`, and response record definitions — unchanged
- External API JSON contract — identical to current
