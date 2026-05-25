# Tasks: Custom Result Pattern for Application Layer

**Input**: Design documents from `specs/003-custom-result-pattern/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**Tests**: None requested — acceptance proof is a running API with all migrated slices compiling and responding correctly.

**Organization**: Tasks are grouped by user story. US1 and US2 are both P1 and are implemented together per feature slice (handler + endpoint always migrate as a unit).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to
- Paths are relative to `backend/cms/OpenCMS.CMS.Application/`

---

## Phase 1: Setup

**Purpose**: No project scaffolding required — `Results.cs` goes into an existing namespace and directory.

*(No setup tasks — proceed directly to Foundational phase.)*

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Create `Results.cs`. Every migration task in Phase 3+ depends on this file existing and compiling.

**⚠️ CRITICAL**: No migration tasks can begin until T001 is complete and the project builds.

- [ ] T001 Create `Configurations/Results.cs` with `Error` record (Code-only, static properties `NotFound`/`Conflict`/`Validation`/`Unexpected`), `Result<T>` sealed class with implicit operators from `T` and `Error`, non-generic `Result` sealed class with implicit operator from `Error`, and `ResultExtensions` static class with `ToHttpResult()` extension methods mapping error codes to `TypedResults.Json(ApiResponse, statusCode)` — see plan.md Phase 1 for the complete type design

**Checkpoint**: `dotnet build` passes before proceeding.

---

## Phase 3: User Stories 1 & 2 — Handler + Endpoint Migration (Priority: P1)

**Goal (US1)**: Every handler returns `Result<T>` instead of a nullable type. Null returns are replaced with `return Error.NotFound;`.

**Goal (US2)**: Every endpoint collapses its null-check ternary into `return result.ToHttpResult();`.

**Independent Test**: Call `GET /assets/{valid-id}` → 200 with data. Call `GET /assets/{unknown-id}` → 404 with `{ "error": ["NOT_FOUND"] }`. Same pattern verifiable for any migrated feature.

> Each task below covers one feature slice (handler + endpoint file pair). All tasks are independent — different directories, no shared file edits.

### Assets

- [ ] T002 [P] [US1][US2] Migrate Assets GetById — `Features/Assets/_Self/GetById/Handler.cs`: change `IRequestHandler<Query, QueryResponse?>` to `IRequestHandler<Query, Result<QueryResponse>>`, replace `return null` with `return Error.NotFound`. `Features/Assets/_Self/GetById/Endpoint.cs`: replace null-check ternary with `return result.ToHttpResult()`
- [ ] T003 [P] [US1][US2] Migrate Assets Delete — `Features/Assets/_Self/Delete/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, replace `return null` with `return Error.NotFound`. `Features/Assets/_Self/Delete/Endpoint.cs`: replace null-check ternary with `return result.ToHttpResult()`
- [ ] T004 [P] [US1][US2] Migrate Assets Update — `Features/Assets/_Self/Update/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, replace `return null` with `return Error.NotFound`. `Features/Assets/_Self/Update/Endpoint.cs`: replace null-check ternary with `return result.ToHttpResult()`
- [ ] T005 [P] [US1][US2] Migrate Assets Create — `Features/Assets/_Self/Create/Handler.cs`: `CommandResponse` → `Result<CommandResponse>` (implicit operator, no logic change). `Features/Assets/_Self/Create/Endpoint.cs`: replace `TypedResults.Json(ApiResponse.Ok(asset), statusCode: 200)` with `return result.ToHttpResult()`
- [ ] T006 [P] [US1][US2] Migrate Assets ListAll — `Features/Assets/_Self/ListAll/Handler.cs`: return type → `Result<List<QueryResponse>>` (implicit operator). `Features/Assets/_Self/ListAll/Endpoint.cs`: replace inline Json call with `return result.ToHttpResult()`
- [ ] T007 [P] [US1][US2] Migrate Assets Feed — `Features/Assets/_Self/Feed/Handler.cs`: migrate return type. `Features/Assets/_Self/Feed/Endpoint.cs`: replace inline Json call with `return result.ToHttpResult()`

### Agents

- [ ] T008 [P] [US1][US2] Migrate Agents GetById — `Features/Agents/_Self/GetById/Handler.cs`: `QueryResponse?` → `Result<QueryResponse>`, replace `return null` with `return Error.NotFound`. `Features/Agents/_Self/GetById/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T009 [P] [US1][US2] Migrate Agents Delete — `Features/Agents/_Self/Delete/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, replace `return null` with `return Error.NotFound`. `Features/Agents/_Self/Delete/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T010 [P] [US1][US2] Migrate Agents Update — `Features/Agents/_Self/Update/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, replace `return null` with `return Error.NotFound`. `Features/Agents/_Self/Update/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T011 [P] [US1][US2] Migrate Agents Create — `Features/Agents/_Self/Create/Handler.cs`: `CommandResponse` → `Result<CommandResponse>` (implicit). `Features/Agents/_Self/Create/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T012 [P] [US1][US2] Migrate Agents Ping — `Features/Agents/_Self/Ping/Handler.cs`: migrate return type. `Features/Agents/_Self/Ping/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T013 [P] [US1][US2] Migrate Agents ListAll — `Features/Agents/_Self/ListAll/Handler.cs`: `List<QueryResponse>` → `Result<List<QueryResponse>>` (implicit). `Features/Agents/_Self/ListAll/Endpoint.cs`: `return result.ToHttpResult()`

### Operations — Self

- [ ] T014 [P] [US1][US2] Migrate Operations GetById — `Features/Operations/_Self/GetById/Handler.cs`: `QueryResponse?` → `Result<QueryResponse>`, replace `return null` with `return Error.NotFound`. `Features/Operations/_Self/GetById/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T015 [P] [US1][US2] Migrate Operations GetActivesByAgent — `Features/Operations/_Self/GetActivesByAgent/Handler.cs`: migrate return type (likely list — implicit). `Features/Operations/_Self/GetActivesByAgent/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T016 [P] [US1][US2] Migrate Operations Create — `Features/Operations/_Self/Create/Handler.cs`: migrate return type (implicit). `Features/Operations/_Self/Create/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T017 [P] [US1][US2] Migrate Operations Delete — `Features/Operations/_Self/Delete/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, replace `return null` with `return Error.NotFound`. `Features/Operations/_Self/Delete/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T018 [P] [US1][US2] Migrate Operations ListAll — `Features/Operations/_Self/ListAll/Handler.cs`: `List<QueryResponse>` → `Result<List<QueryResponse>>` (implicit). `Features/Operations/_Self/ListAll/Endpoint.cs`: `return result.ToHttpResult()`

### Operations — OperationAssets

- [ ] T019 [P] [US1][US2] Migrate OperationAssets Create — `Features/Operations/OperationAssets/Create/Handler.cs`: migrate return type (implicit). `Features/Operations/OperationAssets/Create/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T020 [P] [US1][US2] Migrate OperationAssets Delete — `Features/Operations/OperationAssets/Delete/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, `return null` → `return Error.NotFound`. `Features/Operations/OperationAssets/Delete/Endpoint.cs`: `return result.ToHttpResult()`

### Operations — Orders

- [ ] T021 [P] [US1][US2] Migrate Orders Create — `Features/Operations/Orders/Create/Handler.cs`: migrate return type (implicit). `Features/Operations/Orders/Create/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T022 [P] [US1][US2] Migrate Orders Update — `Features/Operations/Orders/Update/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, `return null` → `return Error.NotFound`. `Features/Operations/Orders/Update/Endpoint.cs`: `return result.ToHttpResult()`
- [ ] T023 [P] [US1][US2] Migrate Orders Delete — `Features/Operations/Orders/Delete/Handler.cs`: `CommandResponse?` → `Result<CommandResponse>`, `return null` → `return Error.NotFound`. `Features/Operations/Orders/Delete/Endpoint.cs`: `return result.ToHttpResult()`

**Checkpoint**: `dotnet build` passes. All 20+ slices compile. Manual test: `GET /assets/{id}` → 200 or 404 with consistent JSON.

---

## Phase 4: User Story 3 — Consistent Error Vocabulary (Priority: P2)

**Goal**: Verify every handler that returns a failure uses the standard `Error.*` static properties (`Error.NotFound`, `Error.Conflict`, etc.) — no raw `new Error("...")` strings scattered across feature slices.

**Independent Test**: Search codebase for `new Error(` — zero occurrences in feature handlers. All error returns use the static property syntax.

- [ ] T024 [US3] Audit all migrated handlers for direct `new Error(` instantiation — replace any occurrences with the appropriate `Error.*` static property; grep across `Features/` to confirm zero raw usages remain

**Checkpoint**: `grep -r "new Error(" backend/cms/OpenCMS.CMS.Application/Features` returns no results.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T025 Full `dotnet build` on the solution to confirm zero compilation errors or warnings introduced by the migration
- [ ] T026 [P] Smoke-test all migrated endpoints via the existing `.http` files in `OpenCMS.CMS.ClientApi` — verify each returns the expected status code and `ApiResponse` JSON shape

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Start immediately — no prerequisites
- **Migration (Phase 3)**: All tasks depend on T001 completing and building successfully
- **Vocabulary audit (Phase 4)**: Depends on Phase 3 completion
- **Polish (Phase 5)**: Depends on Phase 4 completion

### User Story Dependencies

- **US1 + US2 (P1)**: Inseparable at task level — handler and endpoint always migrate together. Can start after T001.
- **US3 (P2)**: Depends on all Phase 3 tasks completing — it's a verification sweep, not new implementation.

### Within Phase 3

All migration tasks (T002–T023) are marked **[P]** — they touch different directories and have no shared file conflicts. They can all be executed in parallel after T001.

---

## Parallel Execution Examples

### After T001 completes — launch all in parallel:

```
T002  Assets/GetById handler + endpoint
T003  Assets/Delete handler + endpoint
T004  Assets/Update handler + endpoint
T005  Assets/Create handler + endpoint
T006  Assets/ListAll handler + endpoint
T007  Assets/Feed handler + endpoint
T008  Agents/GetById handler + endpoint
T009  Agents/Delete handler + endpoint
T010  Agents/Update handler + endpoint
T011  Agents/Create handler + endpoint
T012  Agents/Ping handler + endpoint
T013  Agents/ListAll handler + endpoint
T014  Operations/GetById handler + endpoint
T015  Operations/GetActivesByAgent handler + endpoint
T016  Operations/Create handler + endpoint
T017  Operations/Delete handler + endpoint
T018  Operations/ListAll handler + endpoint
T019  OperationAssets/Create handler + endpoint
T020  OperationAssets/Delete handler + endpoint
T021  Orders/Create handler + endpoint
T022  Orders/Update handler + endpoint
T023  Orders/Delete handler + endpoint
```

---

## Implementation Strategy

### MVP (US1 + US2 only)

1. Complete T001 — `Results.cs` created and building
2. Complete T002 (Assets/GetById) — one slice end-to-end as proof of concept
3. Validate: call `GET /assets/{id}` → 200 and `GET /assets/{unknown-id}` → 404 with `NOT_FOUND` code
4. Complete T003–T023 in parallel — migrate remaining slices
5. **Stop and validate**: full build + smoke test all `.http` files

### Incremental Delivery

1. T001 → foundation in place
2. One slice migrated (T002) → pattern confirmed
3. All slices migrated (T003–T023) → feature complete
4. T024 → vocabulary consistency confirmed
5. T025–T026 → shipped

---

## Notes

- Every [P] task in Phase 3 touches a distinct directory — no merge conflicts possible when run in parallel
- `Error.NotFound` (property, not method) — no parentheses or argument
- Handlers that currently return non-nullable types use the implicit `T → Result<T>` operator — the `return value;` line itself does not change, only the method signature and `IRequestHandler<,>` type parameter
- Build after T001 before starting any migration task
