# Implementation Plan: Unified API Response Structure

**Branch**: `002-unified-api-response` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-unified-api-response/spec.md`

## Summary

Introduce a single `ApiResponse` envelope record in the Application layer that every endpoint returns. The envelope carries `statusCode`, `data`, and `error`. Static factory methods (`Ok`, `NotFound`, `BadRequest`) produce correctly shaped envelopes so endpoint lambdas never construct the envelope manually. The `ValidationExceptionHandler` is updated to write the same envelope for validation failures. All 22 existing endpoints and all HTTP example files are migrated.

## Technical Context

**Language/Version**: C# 13 / .NET 10

**Primary Dependencies**: ASP.NET Core Minimal API, MediatR, FluentValidation

**Storage**: SQLite via EF Core (no schema changes for this feature)

**Testing**: No test projects exist yet

**Target Platform**: Linux / Windows server

**Project Type**: Web service (two ASP.NET Core Minimal API projects sharing one Application layer)

**Performance Goals**: No additional latency requirements beyond standard web API expectations

**Constraints**: No `Results.*` helpers (constitution B-II); response model must not expose domain entities

**Scale/Scope**: 22 existing endpoints across 5 feature groups (Agents, Assets, Operations, Orders, OperationAssets)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — Simplicity First | PASS | One new type (`ApiResponse`), one new factory class — no layers added |
| II — Readable Code | PASS | Factory method names (`Ok`, `NotFound`, `BadRequest`) are self-describing |
| III — SOLID | PASS | `ApiResponse` has a single purpose; factory methods are stateless |
| B-I — Vertical Slice | PASS | `ApiResponse` lives in `Configurations/` (cross-cutting concern), not inside a slice |
| B-II — CQRS / No `Results.*` | PASS | Factory methods are custom, not `Results.*`; endpoint lambdas still return directly |
| B-III — Validation | PASS | ValidationExceptionHandler updated to write the same envelope; pipeline unchanged |
| B-IV — Domain Model Integrity | PASS | No domain entities touched |
| B-V — API Contracts | PASS | All HTTP example files will be updated |

**Post-design re-check**: No violations found after Phase 1 design. No Complexity Tracking entry required.

## Project Structure

### Documentation (this feature)

```text
specs/002-unified-api-response/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api-response.md  # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code

```text
backend/cms/
├── OpenCMS.CMS.Application/
│   └── Configurations/
│       ├── ApiResponse.cs                          ← NEW
│       ├── Behaviors/
│       │   └── ValidationBehavior.cs               (unchanged)
│       ├── Exceptions/
│       │   ├── ValidationException.cs              (unchanged)
│       │   └── ValidationExceptionHandler.cs       ← MODIFY
│       └── ApplicationServiceRegistration.cs       (unchanged)
│   └── Features/
│       ├── Agents/_Self/{Create,Delete,GetById,ListAll,Ping,Update}/Endpoint.cs   ← MODIFY (×6)
│       ├── Assets/_Self/{Create,Delete,Feed,GetById,ListAll,Update}/Endpoint.cs   ← MODIFY (×6)
│       └── Operations/
│           ├── _Self/{Create,Delete,GetActivesByAgent,GetById,ListAll}/Endpoint.cs ← MODIFY (×5)
│           ├── Orders/{Create,Delete,Update}/Endpoint.cs                           ← MODIFY (×3)
│           └── OperationAssets/{Create,Delete}/Endpoint.cs                        ← MODIFY (×2)
└── OpenCMS.CMS.ClientApi/
    └── _http/
        ├── Agents.http       ← MODIFY
        ├── Assets.http       ← MODIFY
        └── Operations.http   ← MODIFY
```
