# Feature Specification: Custom Result Pattern for Application Layer

**Feature Branch**: `003-custom-result-pattern`

**Created**: 2026-05-25

**Status**: Draft

**Input**: GitHub Issue #24 — "Use result types for application layer responses"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Handler Returns Typed Result (Priority: P1)

A developer writing a VSA feature handler wants to express both success and failure outcomes without relying on null returns, exceptions, or out-of-band conventions. The handler returns a `Result<T>` that carries either a value or a structured error, and the calling endpoint can branch on that cleanly.

**Why this priority**: This is the core value of the feature. Everything else builds on top of a working `Result<T>` type.

**Independent Test**: A handler for an existing feature (e.g., GetById) can be migrated to return `Result<QueryResponse>` instead of `QueryResponse?`, and the endpoint can check `result.IsSuccess` to decide whether to return 200 or 404 — end-to-end with no other stories needed.

**Acceptance Scenarios**:

1. **Given** a handler processes a request successfully, **When** it returns a result, **Then** the result carries the value and `IsSuccess` is `true`
2. **Given** a handler cannot find the requested resource, **When** it returns a result, **Then** the result carries a structured error, `IsSuccess` is `false`, and no value is present
3. **Given** a handler encounters a business rule violation, **When** it returns a result, **Then** the result carries a descriptive error with a meaningful code and message

---

### User Story 2 - Endpoint Maps Result to HTTP Response (Priority: P1)

A developer writing an endpoint handler wants to translate a `Result<T>` into an `ApiResponse` and an appropriate HTTP status code without writing ad-hoc null checks or try-catch blocks in every endpoint.

**Why this priority**: Equal priority to story 1 — without the endpoint mapping, the result type provides no user-visible value.

**Independent Test**: An endpoint for GetById maps `Result<QueryResponse>` to a 200 OK with the value, or a 404 with the error message, by reading `result.IsSuccess` and `result.Error`.

**Acceptance Scenarios**:

1. **Given** a result is successful, **When** the endpoint maps it, **Then** the HTTP response has status 200 and the data field contains the value
2. **Given** a result carries a NOT_FOUND error, **When** the endpoint maps it, **Then** the HTTP response has status 404 and the error field contains the error message
3. **Given** a result carries a CONFLICT or VALIDATION error, **When** the endpoint maps it, **Then** the HTTP response reflects the appropriate HTTP status code

---

### User Story 3 - Consistent Error Vocabulary Across Features (Priority: P2)

A developer wants a shared set of named error codes (e.g., `Error.NotFound`, `Error.Conflict`) so that all VSA features use the same vocabulary and the API surface is predictable.

**Why this priority**: Consistency matters but can be iterated on after the core pattern is in place.

**Independent Test**: Two different features (e.g., Assets and Orders) both return `Error.NotFound(...)` when a resource is missing, and both produce identical JSON error structure at the API level.

**Acceptance Scenarios**:

1. **Given** the error vocabulary is defined centrally, **When** any handler produces a not-found error, **Then** the error code is always `NOT_FOUND`
2. **Given** a new feature is added, **When** a developer reaches for a standard error, **Then** named factory methods are available without writing raw strings

---

### Edge Cases

- What happens when a handler returns a success result with a `null` value (e.g., a delete operation that returns no body)?
- What happens when multiple validation errors apply — can the result carry more than one error?
- How does the result pattern interact with the existing `ValidationBehavior` MediatR pipeline behavior, which already throws a `ValidationException`?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a `Result<T>` type that represents either a successful outcome (carrying a value of type `T`) or a failed outcome (carrying an `Error`)
- **FR-002**: The system MUST provide a non-generic `Result` type for operations that succeed with no return value (e.g., delete, fire-and-forget commands)
- **FR-003**: `Result<T>` MUST expose an `IsSuccess` boolean property, a `Value` property (only meaningful on success), and an `Error` property (only meaningful on failure)
- **FR-004**: The system MUST provide an `Error` record with at minimum a `Code` (string) and `Message` (string) field
- **FR-005**: The system MUST provide named factory methods for common error categories: `NotFound`, `Conflict`, `Validation`, and `Unexpected`
- **FR-006**: Handlers MUST be able to return `Result<T>` as their MediatR response type, replacing nullable return types
- **FR-007**: Endpoints MUST be able to map a `Result<T>` to an `ApiResponse` and an HTTP status code using the `Error.Code` to determine the status
- **FR-008**: The `Result<T>` type MUST be defined within the Application layer (alongside existing configurations) so all features can reference it without additional project dependencies
- **FR-009**: The existing `ApiResponse` type MUST remain unchanged; the result type maps into it, not replaces it

### Key Entities

- **Result\<T\>**: Represents the outcome of an application operation; carries either a value (`T`) or an `Error`; is the return type of MediatR handlers
- **Result**: Non-generic variant for void operations; carries either success or an `Error`
- **Error**: Describes a failure; has a `Code` (machine-readable) and `Message` (human-readable); used by endpoints to determine HTTP status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every existing handler that currently returns a nullable type can be migrated to return `Result<T>` with no changes required outside the handler and its corresponding endpoint
- **SC-002**: Endpoints that receive a `Result<T>` require no null checks — branching is done exclusively via `result.IsSuccess`
- **SC-003**: All VSA features produce consistent JSON error structure regardless of which handler returned the error
- **SC-004**: No new NuGet packages are introduced — the feature is self-contained in a single source file in the Application layer
- **SC-005**: The migration of at least one existing feature (handler + endpoint) to the Result pattern serves as the acceptance proof of the implementation

## Assumptions

- The Result pattern is implemented as a hand-rolled source file (`Results.cs`) in `OpenCMS.CMS.Application/Configurations/`, not via a third-party library
- The existing `ValidationBehavior` pipeline behavior continues to throw `ValidationException` for FluentValidation failures; the Result pattern handles business-logic errors returned deliberately by handlers, not pipeline exceptions
- A `null` success value is valid for void operations; the non-generic `Result` type covers this case explicitly
- Only single-error results are needed for now; multi-error results (e.g., list of validation failures) are out of scope
- Migration of existing handlers to the new pattern is part of this feature's acceptance, covering at minimum the Assets feature
