# API Contract: Unified Response Envelope

**Version**: 1.1 | **Date**: 2026-05-23

All endpoints in AgentApi (port 5010) and ClientApi (port 5020) return a response body that
conforms to the following shape. No endpoint may deviate.

## Envelope Shape

```json
{
  "statusCode": <integer>,
  "data": <object | array | null>,
  "error": <string[] | null>
}
```

- `statusCode` — matches the HTTP response status line
- `data` — present on success, `null` on failure
- `error` — present on failure, `null` on success; **always an array of strings when not null** — never a plain string, never an object

---

## Success — Single Object (HTTP 200)

```json
{
  "statusCode": 200,
  "data": {
    "id": "2457b6da-77ce-46bc-aaae-d59748ff2ec3",
    "name": "Agent Alpha"
  },
  "error": null
}
```

## Success — List (HTTP 200)

```json
{
  "statusCode": 200,
  "data": [
    { "id": "2457b6da-77ce-46bc-aaae-d59748ff2ec3", "name": "Agent Alpha" },
    { "id": "b3f1e2a0-11cc-4e8a-b0d5-deadbeef1234", "name": "Agent Beta" }
  ],
  "error": null
}
```

## Not Found (HTTP 404)

```json
{
  "statusCode": 404,
  "data": null,
  "error": ["Agent not found."]
}
```

## Validation Failure (HTTP 400)

All field-level validation messages are flattened into a single array. Field names are not preserved in the response.

```json
{
  "statusCode": 400,
  "data": null,
  "error": [
    "Name is required.",
    "Name must not exceed 200 characters.",
    "AgentType must be a valid value."
  ]
}
```

---

## Error Field Rules

| Scenario | `error` value |
|----------|--------------|
| Success | `null` |
| Not found | `["<Resource> not found."]` — single-element array |
| Validation failure | flat array of all failing rule messages |
| (future) Business rule violation | flat array with the violation message |

---

## Not-Found Message Conventions

Each feature group uses a consistent message for not-found responses:

| Feature group | Message |
|---------------|---------|
| Agents | `"Agent not found."` |
| Assets | `"Asset not found."` |
| Operations | `"Operation not found."` |
| Orders | `"Order not found."` |
| OperationAssets | `"OperationAsset not found."` |
