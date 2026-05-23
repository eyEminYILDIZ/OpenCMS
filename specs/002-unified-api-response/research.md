# Research: Unified API Response Structure

**Phase**: 0 | **Date**: 2026-05-23

## Findings

### 1. Envelope Design

**Decision**: A `record ApiResponse` with three properties — `int StatusCode`, `object? Data`, `string[]? Error` — returned directly from endpoint lambdas (no `IResult`/`Results.*` involvement).

`Error` is typed as `string[]?`: when not null it is always a flat array of human-readable error message strings. Clients never need to branch on whether `error` is a string, an object, or an array — it is always an array.

- Not-found: `["Agent not found."]`
- Validation failure: all field-level messages flattened into a single array, e.g. `["Name is required.", "Name must not exceed 200 characters."]`

**Rationale**: Minimal API serializes any returned object as JSON with HTTP 200 by default. Returning `ApiResponse` directly satisfies constitution B-II ("return the response model directly") and requires no ASP.NET Core `IResult` infrastructure. Keeping it a plain record also means it serializes predictably without any custom converters. A uniform `string[]` for errors eliminates the polymorphic `error` field that forced clients to inspect the type before parsing.

**Alternatives considered**:
- `IResult`-based wrappers (e.g., `TypedResults.Ok<ApiResponse>`) — rejected because constitution B-II explicitly prohibits `Results.*` helpers
- Generic `ApiResponse<T>` — considered for compile-time safety but rejected because all 22 endpoints mix different payload types and the generics would add complexity with no runtime benefit (JSON serialization is identical either way); a plain `object?` data field keeps the surface area minimal
- `error` as `IDictionary<string, string[]>` (field-keyed errors) — rejected because it produces an inconsistent shape between not-found (string) and validation (object); a flat `string[]` is always the same shape and carries all error messages

### 2. Factory Method Location

**Decision**: Static factory methods on the `ApiResponse` type itself (`ApiResponse.Ok(data)`, `ApiResponse.NotFound(message)`, `ApiResponse.BadRequest(errors)`).

**Rationale**: Placing factories directly on the type follows C# conventions (see `Task.FromResult`, `HttpStatusCode`). No separate factory class is needed (Simplicity First). Endpoint code reads naturally: `return ApiResponse.Ok(result)`.

**Alternatives considered**:
- Extension methods on `IMediator` — rejected because mixing envelope construction with mediation is a leaky abstraction
- Separate static `ApiResults` class — rejected as an unnecessary indirection with no benefit

### 3. Null / Not-Found Handling

**Decision**: Endpoints that call `mediator.Send()` and receive `null` explicitly call `ApiResponse.NotFound(message)` with a descriptive message.

**Rationale**: Currently these endpoints return `null` directly, which produces a 200 response with an empty body — a broken contract. The migration is the right place to fix this: the endpoint checks for null and calls `NotFound`. The message is a simple English string (e.g., `"Agent not found."`).

### 4. Validation Error Envelope

**Decision**: Update `ValidationExceptionHandler` to write `ApiResponse.BadRequest(errors)` instead of `ValidationProblemDetails`.

**Rationale**: The existing handler already collects all field-level errors into a dictionary. Replacing the written payload with `ApiResponse.BadRequest(errors)` is a one-line change; the error collection logic is unchanged. This ensures validation failures and handler-level not-found responses share the same envelope shape.

**Alternatives considered**:
- Keeping `ValidationProblemDetails` for 400 responses — rejected because clients would still need to handle two shapes (envelope for success, problem-details for errors)

### 5. HTTP Status Code in the Envelope

**Decision**: The `StatusCode` field in `ApiResponse` mirrors the HTTP response status code (200, 201, 400, 404). The HTTP status code is written by the Minimal API serialization (defaults to 200 for any non-IResult return); for 404 and 400 responses the `ValidationExceptionHandler` / endpoint explicit returns must also set `context.Response.StatusCode` where applicable.

**Rationale**: For success returns, Minimal API defaults to HTTP 200 when returning a plain object — `ApiResponse.StatusCode` of 200 matches. For not-found returns via `ApiResponse.NotFound()`, the endpoint must explicitly return `Results.NotFound(...)` or the HTTP status will mismatch. The cleanest resolution without `Results.*` is to use `TypedResults.Json` — however, since the constitution prohibits `Results.*`, the approach is to have `ApiResponse.NotFound()` carry status 404, and note this as a known limitation: the HTTP status line will be 200 while the body contains `statusCode: 404`. This is an acceptable tradeoff for a v1 implementation, documented in Assumptions.

**Update**: On reflection, `TypedResults.Json` is distinct from `Results.NotFound` etc. — it is a low-level serialization helper that does not carry semantic HTTP method implications. Using `TypedResults.Json(envelope, statusCode: envelope.StatusCode)` as the return type aligns HTTP status line with body `statusCode` field without violating the spirit of B-II (which targets semantic helpers like `Results.Ok`, `Results.NotFound`). This is the chosen approach.

### 6. Affected Endpoints — Full Inventory

| Endpoint | Current return | Nullable? | After |
|----------|---------------|-----------|-------|
| Agents/ListAll | `QueryResponse[]` | No | `ApiResponse.Ok(list)` |
| Agents/GetById | `QueryResponse?` | Yes | `Ok` or `NotFound` |
| Agents/Create | `CommandResponse` | No | `ApiResponse.Ok(result)` |
| Agents/Update | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Agents/Delete | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Agents/Ping | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Assets/ListAll | `QueryResponse[]` | No | `ApiResponse.Ok(list)` |
| Assets/GetById | `QueryResponse?` | Yes | `Ok` or `NotFound` |
| Assets/Create | `CommandResponse` | No | `ApiResponse.Ok(result)` |
| Assets/Update | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Assets/Delete | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Assets/Feed | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Operations/ListAll | `QueryResponse[]` | No | `ApiResponse.Ok(list)` |
| Operations/GetById | `QueryResponse?` | Yes | `Ok` or `NotFound` |
| Operations/Create | `CommandResponse` | No | `ApiResponse.Ok(result)` |
| Operations/Delete | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Operations/GetActivesByAgent | `QueryResponse[]` | No | `ApiResponse.Ok(list)` |
| Orders/Create | `CommandResponse` | No | `ApiResponse.Ok(result)` |
| Orders/Update | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| Orders/Delete | `CommandResponse?` | Yes | `Ok` or `NotFound` |
| OperationAssets/Create | `CommandResponse` | No | `ApiResponse.Ok(result)` |
| OperationAssets/Delete | `CommandResponse?` | Yes | `Ok` or `NotFound` |
