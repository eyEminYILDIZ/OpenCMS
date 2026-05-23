# Tasks: Unified API Response Structure

**Input**: Design documents from `specs/002-unified-api-response/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: No test projects exist; no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: Which user story this task belongs to (US1 / US2 / US3)

## Path Conventions

All paths are relative to the repository root.

---

## Phase 1: Setup

No project initialization required — the backend project already exists and no new dependencies are needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `ApiResponse` envelope type and update the validation exception handler. Every user story depends on both tasks being complete before any endpoint can be migrated.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Create `ApiResponse` record with `int StatusCode`, `object? Data`, `string[]? Error` properties and static factory methods `Ok(object data)`, `NotFound(string message)`, `BadRequest(IReadOnlyDictionary<string, string[]> errors)` in `backend/cms/OpenCMS.CMS.Application/Configurations/ApiResponse.cs`. `Ok` sets StatusCode=200 and Error=null. `NotFound` sets StatusCode=404, Data=null, Error=[message]. `BadRequest` flattens all dictionary values with `.SelectMany(e => e.Value).ToArray()` into Error, sets StatusCode=400, Data=null.

- [x] T002 Update `ValidationExceptionHandler` to write `ApiResponse.BadRequest(validationException.Errors)` as JSON and set `context.Response.StatusCode = 400` instead of writing `ValidationProblemDetails` in `backend/cms/OpenCMS.CMS.Application/Configurations/Exceptions/ValidationExceptionHandler.cs`. Remove the `ValidationProblemDetails` construction entirely.

**Checkpoint**: `ApiResponse` compiles and validation failures now return the unified envelope. No endpoint migration yet.

---

## Phase 3: User Story 1 — Agents Group (Priority: P1) 🎯 MVP

**Goal**: Every Agents endpoint returns the `{statusCode, data, error}` envelope. A client developer can send requests to all six Agents endpoints and parse all responses with the same code path.

**Independent Test**: Start ClientApi or AgentApi, call `GET /agents` (list), `GET /agents/{valid-id}` (found), `GET /agents/{invalid-id}` (not found), and `POST /agents` with an invalid body (validation failure). Confirm all four responses have exactly the fields `statusCode`, `data`, and `error` at the top level, with correct null/non-null values.

- [x] T003 [P] [US1] Update `Agents/ListAll/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(agents), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/ListAll/Endpoint.cs`

- [x] T004 [P] [US1] Update `Agents/GetById/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/GetById/Endpoint.cs`

- [x] T005 [P] [US1] Update `Agents/Create/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/Create/Endpoint.cs`

- [x] T006 [P] [US1] Update `Agents/Update/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/Update/Endpoint.cs`

- [x] T007 [P] [US1] Update `Agents/Delete/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/Delete/Endpoint.cs`

- [x] T008 [P] [US1] Update `Agents/Ping/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Agent not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(agent), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Agents/_Self/Ping/Endpoint.cs`

**Checkpoint**: All Agents endpoints return the unified envelope. User Story 1 is independently testable and deliverable.

---

## Phase 4: User Story 2 — Assets Group (Priority: P2)

**Goal**: The return helpers (`ApiResponse.Ok`, `ApiResponse.NotFound`) are proven to work consistently across a second feature group. A developer can follow the same pattern for any new endpoint.

**Independent Test**: Start ClientApi or AgentApi, call `GET /assets`, `GET /assets/{valid-id}`, `GET /assets/{invalid-id}`, and `PUT /assets/{id}/feed`. Confirm all responses follow the unified envelope.

- [x] T009 [P] [US2] Update `Assets/ListAll/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(assets), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/ListAll/Endpoint.cs`

- [x] T010 [P] [US2] Update `Assets/GetById/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/GetById/Endpoint.cs`

- [x] T011 [P] [US2] Update `Assets/Create/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/Create/Endpoint.cs`

- [x] T012 [P] [US2] Update `Assets/Update/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/Update/Endpoint.cs`

- [x] T013 [P] [US2] Update `Assets/Delete/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/Delete/Endpoint.cs`

- [x] T014 [P] [US2] Update `Assets/Feed/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Asset not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Assets/_Self/Feed/Endpoint.cs`

**Checkpoint**: Agents and Assets groups both return the unified envelope. User Story 2 is independently testable.

---

## Phase 5: User Story 3 — Operations, Orders, OperationAssets & HTTP Examples (Priority: P3)

**Goal**: All 22 endpoints across all feature groups return the unified envelope. Every HTTP example file updated to show the new response shape. Migration is 100% complete.

**Independent Test**: Call every endpoint listed in `_http/Agents.http`, `_http/Assets.http`, and `_http/Operations.http`. Confirm every response body has exactly `statusCode`, `data`, and `error` at the top level. Confirm not-found and validation failure responses also conform.

### Operations — _Self (5 endpoints)

- [x] T015 [P] [US3] Update `Operations/_Self/ListAll/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(operations), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/_Self/ListAll/Endpoint.cs`

- [x] T016 [P] [US3] Update `Operations/_Self/GetById/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Operation not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(operation), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/_Self/GetById/Endpoint.cs`

- [x] T017 [P] [US3] Update `Operations/_Self/Create/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(operation), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/_Self/Create/Endpoint.cs`

- [x] T018 [P] [US3] Update `Operations/_Self/Delete/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Operation not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/_Self/Delete/Endpoint.cs`

- [x] T019 [P] [US3] Update `Operations/_Self/GetActivesByAgent/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(operations), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/_Self/GetActivesByAgent/Endpoint.cs`

### Operations — Orders (3 endpoints)

- [x] T020 [P] [US3] Update `Operations/Orders/Create/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(order), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/Orders/Create/Endpoint.cs`

- [x] T021 [P] [US3] Update `Operations/Orders/Update/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Order not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(order), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/Orders/Update/Endpoint.cs`

- [x] T022 [P] [US3] Update `Operations/Orders/Delete/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("Order not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/Orders/Delete/Endpoint.cs`

### Operations — OperationAssets (2 endpoints)

- [x] T023 [P] [US3] Update `Operations/OperationAssets/Create/Endpoint.cs` to return `TypedResults.Json(ApiResponse.Ok(operationAsset), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/OperationAssets/Create/Endpoint.cs`

- [x] T024 [P] [US3] Update `Operations/OperationAssets/Delete/Endpoint.cs` to return `TypedResults.Json(ApiResponse.NotFound("OperationAsset not found."), statusCode: 404)` when result is null, otherwise `TypedResults.Json(ApiResponse.Ok(deleted), statusCode: 200)` in `backend/cms/OpenCMS.CMS.Application/Features/Operations/OperationAssets/Delete/Endpoint.cs`

### HTTP Example Files (3 files)

- [x] T025 [US3] Update `Agents.http` response comment blocks to show the unified envelope shape — success list, success single, 404, and 400 examples — in `backend/cms/OpenCMS.CMS.ClientApi/_http/Agents.http`

- [x] T026 [P] [US3] Update `Assets.http` response comment blocks to show the unified envelope shape — success list, success single, 404, and 400 examples — in `backend/cms/OpenCMS.CMS.ClientApi/_http/Assets.http`

- [x] T027 [P] [US3] Update `Operations.http` response comment blocks to show the unified envelope shape — success list, success single, 404, and 400 examples — in `backend/cms/OpenCMS.CMS.ClientApi/_http/Operations.http`

**Checkpoint**: All 22 endpoints migrated, all HTTP example files updated. User Story 3 complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build verification across both APIs to confirm no endpoint was missed.

- [x] T028 Build and run `ClientApi` (`dotnet run --project cms/OpenCMS.CMS.ClientApi`), call at least one endpoint from each feature group via the `.http` files, and confirm all responses conform to the unified envelope in `backend/cms/OpenCMS.CMS.ClientApi`

- [x] T029 [P] Build and run `AgentApi` (`dotnet run --project cms/OpenCMS.CMS.AgentApi`), call `GET /agents` and `PUT /assets/{id}/feed`, and confirm both return the unified envelope in `backend/cms/OpenCMS.CMS.AgentApi`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (Foundational)**: No dependencies — start immediately
- **Phase 3 (US1)**: Depends on Phase 2 completion — BLOCKS
- **Phase 4 (US2)**: Depends on Phase 2 completion — can run in parallel with Phase 3
- **Phase 5 (US3)**: Depends on Phase 2 completion — can run in parallel with Phase 3 and 4
- **Phase 6 (Polish)**: Depends on Phases 3, 4, 5 all complete

### User Story Dependencies

- **US1 (Phase 3)**: Depends only on Foundational (T001, T002)
- **US2 (Phase 4)**: Depends only on Foundational (T001, T002)
- **US3 (Phase 5)**: Depends only on Foundational (T001, T002)

All three user story phases can be worked in parallel once Phase 2 is done.

### Within Each User Story

- All endpoint tasks within a user story phase are marked [P] — they touch different files and have no dependencies on each other
- HTTP example file updates (T025–T027) are independent of each other [P], but logically follow endpoint migration

### Parallel Opportunities

- T003–T008 (US1 Agents): All parallel — 6 different files
- T009–T014 (US2 Assets): All parallel — 6 different files
- T015–T024 (US3 Operations): All parallel — 10 different files
- T025–T027 (HTTP examples): All parallel — 3 different files
- T028–T029 (Polish): Parallel — 2 different projects

---

## Parallel Example: All Three User Stories

```bash
# After Phase 2 completes, launch all three stories simultaneously:

Task [US1]: T003 Update Agents/ListAll/Endpoint.cs
Task [US1]: T004 Update Agents/GetById/Endpoint.cs
Task [US1]: T005 Update Agents/Create/Endpoint.cs
Task [US1]: T006 Update Agents/Update/Endpoint.cs
Task [US1]: T007 Update Agents/Delete/Endpoint.cs
Task [US1]: T008 Update Agents/Ping/Endpoint.cs

Task [US2]: T009 Update Assets/ListAll/Endpoint.cs
... (all Assets endpoints in parallel)

Task [US3]: T015 Update Operations/_Self/ListAll/Endpoint.cs
... (all Operations/Orders/OperationAssets endpoints in parallel)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002) — CRITICAL
2. Complete Phase 3: US1 — Agents group (T003–T008)
3. **STOP and VALIDATE**: Call all Agents endpoints, confirm envelope shape
4. Ship/demo if ready

### Incremental Delivery

1. Phase 2 → Foundation ready (ApiResponse + ValidationExceptionHandler)
2. Phase 3 → Agents migrated → validate → demo MVP
3. Phase 4 → Assets migrated → validate independently
4. Phase 5 → Operations, Orders, OperationAssets migrated + HTTP examples updated → full migration complete
5. Phase 6 → Build verification across both APIs

### Parallel Team Strategy

With two developers after Phase 2:

- Developer A: Phase 3 (US1 — Agents)
- Developer B: Phase 4 (US2 — Assets)
- Both merge → Developer A or B: Phase 5 (US3 — Operations group)

---

## Notes

- `TypedResults.Json` is used in every endpoint to align the HTTP status line with the envelope `statusCode` field. It is a low-level serialization helper, not a semantic `Results.*` shortcut.
- All six Agents endpoints and six Assets endpoints already return a nullable result from the handler — check for `null` and call `ApiResponse.NotFound` accordingly.
- `Operations/OperationAssets/Create` has a `Console.WriteLine` debug line that can be removed during migration (T023).
- [P] tasks = different files, no shared state — safe to run concurrently
- Commit after each phase or after logical groups of [P] tasks complete
