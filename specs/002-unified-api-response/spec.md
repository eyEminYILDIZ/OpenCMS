# Feature Specification: Unified API Response Structure

**Feature Branch**: `002-unified-api-response`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "i want to implement issue #16. After this implementation i will be able to use endpoints in web and mobile clients consistently. Every response body will be the same as structure. Only statusCode, data and error field values will be change according to endpoint behaviour. After creating a common response model, i need specific return methods in minimal api endpoints, such as return Ok(object), Ok(array) BadRequest(errors), etc. After all of this, all endpoint responses must be change for current vsa features."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Web/Mobile Client Receives Consistent Response Shape (Priority: P1)

A web or mobile client developer calls any CMS endpoint and receives a response body that always has the same top-level structure, regardless of whether the call succeeded or failed. The developer can write a single response-parsing function shared across all API calls.

**Why this priority**: This is the core value of the feature. Without a predictable envelope, clients must handle each endpoint differently and cannot share response-handling code.

**Independent Test**: Send requests to two different endpoints (one success, one failure) and confirm both return an object with exactly the fields `statusCode`, `data`, and `error` at the top level.

**Acceptance Scenarios**:

1. **Given** a client calls a successful list endpoint, **When** the response arrives, **Then** the body contains `statusCode` matching the HTTP status code, a `data` field holding an array, and `error` set to `null`.
2. **Given** a client calls a successful get-by-id endpoint, **When** the response arrives, **Then** the body contains `statusCode` matching the HTTP status code, a `data` field holding a single object, and `error` set to `null`.
3. **Given** a client calls a create endpoint with invalid input, **When** the response arrives, **Then** the body contains `statusCode` matching the HTTP error status code, `data` set to `null`, and `error` holding the error details.
4. **Given** a client calls a get-by-id endpoint with a non-existent id, **When** the response arrives, **Then** the body contains `statusCode` 404, `data` set to `null`, and `error` with a descriptive message.

---

### User Story 2 - Backend Developer Uses Typed Return Helpers in Endpoint Definitions (Priority: P2)

A backend developer adding or editing a Vertical Slice endpoint uses purpose-built helper methods (e.g., `Ok(object)`, `Ok(array)`, `BadRequest(errors)`, `NotFound(message)`) instead of constructing the envelope manually. The helpers enforce the correct envelope shape automatically.

**Why this priority**: Without helpers, each developer must remember to construct the envelope correctly. Helpers eliminate repetition and enforce consistency at the source.

**Independent Test**: Implement one new endpoint using only the helpers. Confirm the response body matches the standard envelope without any manual envelope construction in the endpoint code.

**Acceptance Scenarios**:

1. **Given** an endpoint handler returns a single object result, **When** the developer calls `Ok(object)`, **Then** the response body contains the object in the `data` field and `error` as `null`.
2. **Given** an endpoint handler returns a list result, **When** the developer calls `Ok(array)`, **Then** the response body contains the list in the `data` field and `error` as `null`.
3. **Given** an endpoint receives invalid input and validation fails, **When** the developer calls `BadRequest(errors)`, **Then** the response body contains `null` in `data` and the validation error details in `error`.
4. **Given** an endpoint cannot find a requested resource, **When** the developer calls `NotFound(message)`, **Then** the response body contains `null` in `data` and a descriptive message in `error`.

---

### User Story 3 - All Existing Endpoints Migrated to Unified Structure (Priority: P3)

All currently implemented VSA feature endpoints (Agents, Assets, Operations, Orders, OperationAssets) return the unified envelope without any manual migration step by the client team.

**Why this priority**: Existing clients break if some endpoints use the old structure while others use the new one. Migration must be complete before the feature is considered done.

**Independent Test**: Call every existing endpoint and confirm each response body conforms to the unified envelope shape.

**Acceptance Scenarios**:

1. **Given** all existing endpoints are running with updated code, **When** a client calls any endpoint across all feature groups, **Then** every response body contains `statusCode`, `data`, and `error` at the top level.
2. **Given** the migration is complete, **When** an HTTP example file for a feature is executed, **Then** the response shown matches the unified envelope format.

---

### Edge Cases

- What happens when an unhandled exception occurs? The error envelope should still be returned with an appropriate status code and a generic error message — not a raw stack trace or framework default HTML error page.
- What happens when a handler returns `null` for a not-found scenario? The response must wrap `null` in `data` with a 404 status code and a `null` or empty `error`, or surface a `NotFound` helper result.
- What happens when multiple validation errors occur simultaneously? All errors must be included in the `error` field, not just the first one.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define a single, shared response envelope type with exactly three fields: `statusCode` (integer), `data` (nullable object or array), and `error` (nullable object or string).
- **FR-002**: The system MUST provide a set of typed return helpers for use in minimal API endpoint definitions, covering at minimum: `Ok(object)`, `Ok(array)`, `BadRequest(errors)`, `NotFound(message)`.
- **FR-003**: Every endpoint MUST use the unified envelope as its HTTP response body — no endpoint may return a raw domain model or a non-envelope response body.
- **FR-004**: On success, the envelope's `data` field MUST contain the response payload and `error` MUST be `null`.
- **FR-005**: On failure, the envelope's `data` field MUST be `null` and `error` MUST contain descriptive error information.
- **FR-006**: The `statusCode` field in the envelope MUST mirror the HTTP status code of the response.
- **FR-007**: All existing VSA feature endpoints (Agents, Assets, Operations, Orders, OperationAssets) MUST be updated to use the unified envelope and helpers.
- **FR-008**: Validation failure responses (HTTP 400) MUST surface all validation error messages in the `error` field, not just the first one.
- **FR-009**: The HTTP example files (`.http` files) for all existing features MUST be updated to reflect the new response structure so developers can see the expected shape.

### Key Entities

- **ApiResponse**: The unified envelope sent as the HTTP response body. Contains `statusCode`, `data`, and `error`. `data` is populated on success and null on failure; `error` is populated on failure and null on success.
- **Return Helper**: A function or extension method available inside endpoint definitions. Accepts a payload or error details and produces a correctly structured `ApiResponse` with the appropriate HTTP status code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every endpoint in the system returns a response body that contains all three fields (`statusCode`, `data`, `error`) — zero endpoints may deviate.
- **SC-002**: A client developer can write a single response-parsing function that handles 100% of endpoint responses without conditional branching on response shape.
- **SC-003**: Adding a new endpoint requires zero manual envelope construction — the developer calls a helper and the envelope is produced automatically.
- **SC-004**: All existing HTTP example files are updated and demonstrate the unified response format, enabling developers to verify the structure without running code.
- **SC-005**: Validation errors from any endpoint include all failing field messages in a single response, not partial or truncated lists.

## Assumptions

- The current validation pipeline already collects all validation errors before responding; this feature exposes them through the unified envelope without replacing the validation logic.
- The unified response envelope applies to both AgentApi and ClientApi — both APIs share the same response shape.
- HTTP example files exist for all feature groups and only need content updates, not structural creation.
- The `error` field for validation failures will be a structured object (field name → messages map) rather than a plain string, to preserve detail; for other errors it may be a plain string or simple object.
- No breaking-change versioning strategy is required for this migration since the project is in early development and has no external consumers yet.
