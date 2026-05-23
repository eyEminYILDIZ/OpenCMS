# Quickstart: Unified API Response Structure

**Date**: 2026-05-23

## What Changed

Every endpoint now returns an `ApiResponse` envelope instead of a raw response model. The shape is always:

```json
{ "statusCode": 200, "data": { ... }, "error": null }                  // success
{ "statusCode": 404, "data": null, "error": ["Agent not found."] }     // not found
{ "statusCode": 400, "data": null, "error": ["Name is required."] }   // validation failure
```

`error` is **always** `string[] | null` — never a plain string, never an object. Clients can always call `.forEach` / iterate without checking the type first.

## Using the Helpers in a New Endpoint

```csharp
return app.MapGet("/things/{id}", async (Guid id, IMediator mediator) =>
{
    var result = await mediator.Send(new Query { Id = id });
    return result is null
        ? TypedResults.Json(ApiResponse.NotFound("Thing not found."), statusCode: 404)
        : TypedResults.Json(ApiResponse.Ok(result), statusCode: 200);
});
```

For endpoints where the handler never returns null:

```csharp
return app.MapGet("/things", async (IMediator mediator) =>
{
    var result = await mediator.Send(new Query());
    return TypedResults.Json(ApiResponse.Ok(result), statusCode: 200);
});
```

## Validation Errors

Validation failures are still handled by `ValidationBehavior` + `ValidationExceptionHandler`. The client now receives the same envelope shape — no code change needed in validators or handlers.

## Testing an Endpoint

Use the `.http` files in `backend/cms/OpenCMS.CMS.ClientApi/_http/` to send requests and verify the envelope shape in the response.
