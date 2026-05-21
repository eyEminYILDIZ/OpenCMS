<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Added sections:
  - Core Principles (shared across all sub-projects)
  - Backend Principles (.NET 10 / Vertical Slice / CQRS / DDD)
  - Webapp Principles (placeholder, project is currently empty)
  - Mobile Principles (placeholder, project is currently empty)
  - Governance
Removed sections: none (initial population from template)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ Constitution Check section references updated principles
  - .specify/templates/spec-template.md ✅ No structural change required
  - .specify/templates/tasks-template.md ✅ No structural change required
Deferred TODOs:
  - RATIFICATION_DATE: set to today (2026-05-21) as the first formal version
  - Webapp and Mobile sections marked as living stubs; expand when sub-projects are scaffolded
-->

# OpenCMS Constitution

## Core Principles (All Sub-Projects)

### I. Simplicity First (NON-NEGOTIABLE)

Every line of code MUST justify its existence. Prefer the simplest solution that correctly
solves the problem. YAGNI (You Ain't Gonna Need It) is the default stance.

- Do NOT add abstractions, layers, or indirections unless a concrete, present need demands them.
- Three similar lines is acceptable; a premature abstraction is not.
- When in doubt between two approaches, choose the one with fewer concepts.
- Complexity MUST be documented in the plan's Complexity Tracking table with a justification.

**Rationale**: Over-engineered code is harder to read, harder to test, and harder to change.
Simplicity is the single most effective quality attribute.

### II. Readable Code (NON-NEGOTIABLE)

Code is read far more often than it is written. Readability MUST be treated as a first-class
requirement, not an afterthought.

- Names MUST be self-describing: variables, methods, classes, and files reveal intent without
  requiring a comment to explain them.
- Functions and methods MUST do one thing. If a method name requires "and", split it.
- Comments MUST explain WHY, not WHAT. Code that needs a comment to explain what it does
  MUST be rewritten to be clearer instead.
- Maximum method length: 100 lines (backend). Exceptions require justification.
- No abbreviations in names except universally understood acronyms (e.g., `Id`, `Url`, `Http`).

**Rationale**: Readable code reduces review time, lowers onboarding cost, and prevents
misunderstanding-driven bugs.

### III. SOLID Design

All production code MUST conform to SOLID principles:

- **S — Single Responsibility**: A class MUST have one reason to change. Do not mix concerns.
- **O — Open/Closed**: Extend behavior through composition or new types; do not modify stable,
  tested code to add features.
- **L — Liskov Substitution**: Subtypes MUST be substitutable for their base types without
  altering correctness. Avoid empty overrides or `NotImplementedException` in subclasses.
- **I — Interface Segregation**: Interfaces MUST be narrow. Clients MUST NOT be forced to
  depend on methods they do not use.
- **D — Dependency Inversion**: High-level modules MUST NOT depend on low-level modules.
  Both MUST depend on abstractions. Inject dependencies; do not instantiate collaborators
  inside business logic.

**Rationale**: SOLID principles prevent the accumulation of coupling and rigidity that makes
codebases expensive to maintain over time.

---

## Backend Principles (.NET 10 / Vertical Slice Architecture)

### B-I. Vertical Slice Architecture (NON-NEGOTIABLE)

Every feature MUST live in its own vertical slice under `Features/{Feature}/_Self/{Operation}/`.
Cross-cutting concerns (auth, validation, logging) belong in pipeline behaviors — not in slices.

- Required files per operation: `Endpoint.cs`, `Command.cs` or `Query.cs`, `Handler.cs`.
- Add `Validator.cs` for every `Command` or `Query` that has at least one property.
- Do NOT create a `Validator.cs` for parameter-less commands or queries.
- Slices MUST NOT reference other slices directly. Share through domain types only.

**Rationale**: Vertical slices isolate change impact to a single folder and prevent horizontal
coupling between features.

### B-II. CQRS — Commands and Queries

- Commands MUST NOT return domain entities; return a dedicated `CommandResponse` record.
- Queries MUST NOT return domain entities; return a dedicated `QueryResponse` record.
- Response records MUST be defined inside the same file as the command or query they belong to.
- Never use `Results.*` helpers (e.g., `Results.Ok()`, `Results.NotFound()`). Return the
  response model directly from the endpoint lambda. Return `null` for not-found cases.
- MediatR is the ONLY allowed in-process messaging mechanism.

**Rationale**: Returning entities from endpoints leaks domain internals and creates coupling
between the API contract and the persistence model.

### B-III. Validation

- FluentValidation MUST be used for all input validation.
- Every rule MUST include `.WithMessage()` with a human-readable message.
- Validation MUST be enforced through the `ValidationBehavior` MediatR pipeline — not inline
  in handlers or endpoints.
- Business rule violations (e.g., entity not found, duplicate) belong in the handler, not in
  the validator.

**Rationale**: Centralizing validation in pipeline behaviors keeps handlers focused on business
logic and ensures consistent HTTP 400 error responses.

### B-IV. Domain Model Integrity

- Entities MUST inherit from the established hierarchy:
  `CoreEntity (Guid Id)` → `BaseEntity (timestamps)` → domain type.
- Domain entities MUST NOT contain infrastructure concerns (EF navigation props are allowed
  but MUST NOT be exposed in response models).
- Enums MUST be defined in the Domain project.
- Do NOT add new entities to Infrastructure; domain types live in Domain.

**Rationale**: A clean domain model is the foundation of DDD. Infrastructure details that
leak into domain types create coupling that defeats the architecture.

### B-V. API Contracts

- Every new endpoint MUST have a matching HTTP example block in the relevant `_http/*.http`
  file inside the ClientApi project.
- Endpoint routes MUST follow REST conventions: nouns, not verbs; plural resource names.
- Breaking API changes MUST be versioned. Do NOT remove or rename existing response fields
  without a migration plan.

**Rationale**: HTTP examples serve as living documentation and allow developers to test
endpoints without a full client setup.

---

## Webapp Principles (React / TypeScript)

> **Status**: Sub-project is currently empty. These are founding principles to apply when
> development begins. Expand this section as the tech stack is confirmed.

### W-I. Component Simplicity

- Components MUST do one thing. Presentational components MUST NOT contain business logic.
- Extract logic into custom hooks; keep JSX trees shallow and readable.
- Avoid prop drilling beyond two levels — use context or a state management solution.

### W-II. Typed Contracts

- TypeScript MUST be used with `strict` mode enabled. No `any` types in production code.
- API response shapes MUST be typed and co-located with the service layer that fetches them.
- Do NOT use `as` type assertions to silence compiler errors; fix the underlying type instead.

### W-III. Accessibility

- Every interactive element MUST be keyboard-navigable and have a semantic HTML role or
  explicit `aria-*` attribute.
- Color MUST NOT be the sole means of conveying information.

### W-IV. State Management Simplicity

- Prefer local component state. Promote to global state only when two or more unrelated
  components share the same piece of data.
- Do NOT store server-fetched data in client state when a query cache (e.g., React Query)
  can handle it.

**Rationale**: Frontend complexity compounds quickly. Keeping components small and typed
prevents the UI layer from becoming an unmaintainable tangle.

---

## Mobile Principles (React Native)

> **Status**: Sub-project is currently empty. Technology stack is not yet confirmed.
> These are founding principles; refine once the stack decision is made.

### M-I. Platform-Native Behavior

- UI patterns MUST respect platform conventions (iOS Human Interface Guidelines / Material
  Design). Do NOT port desktop or web interaction patterns to mobile unchanged.
- Navigation MUST use the platform's native navigation paradigm.

### M-II. Offline-First Mindset

- Features that users will access without connectivity MUST handle offline gracefully:
  optimistic updates, local caching, and clear sync-state indicators.
- Do NOT assume network availability inside business logic.

### M-III. Performance Budget

- The main thread MUST NOT be blocked by heavy computation or synchronous I/O.
- Offload all parsing, cryptographic operations, and large data transforms to background
  isolates / workers.
- Target 60 fps for all animations; avoid layout jank.

### M-IV. Typed Contracts (mirrors W-II)

- Use strict typing throughout. Shared API contracts between mobile and backend MUST be
  generated from the OpenAPI spec to avoid drift.

**Rationale**: Mobile users notice performance regressions and UX inconsistencies more acutely
than desktop users. A disciplined, offline-aware architecture prevents costly rewrites.

---

## Governance

This constitution supersedes all other development guidelines within the OpenCMS repository.
When a sub-project's own `CLAUDE.md` conflicts with a principle here, the constitution takes
precedence unless the sub-project's principle is a narrower, non-conflicting refinement.

**Amendment procedure**:
1. Open a PR with the proposed change to this file.
2. State the reason, the principle affected, and any migration steps required.
3. Bump the version according to semantic versioning rules (MAJOR / MINOR / PATCH).
4. Update all dependent artifacts listed in the Sync Impact Report.
5. PR MUST be reviewed and approved before merge.

**Versioning policy**:
- MAJOR: Removal or incompatible redefinition of an existing principle.
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarification, wording, or non-semantic refinement.

**Compliance review**: All PRs MUST verify adherence to the Core Principles. Backend PRs
MUST additionally verify adherence to the Backend Principles. Feature plans (plan.md) MUST
include a Constitution Check gate.

**Version**: 1.0.0 | **Ratified**: 2026-05-21 | **Last Amended**: 2026-05-21
