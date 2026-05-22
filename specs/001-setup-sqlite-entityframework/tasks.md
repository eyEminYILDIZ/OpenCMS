# Tasks: Setup SQLite with Entity Framework

**Input**: Design documents from `specs/001-setup-sqlite-entityframework/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅

**Tests**: Not requested — no test projects exist in this codebase.

**Organization**: Tasks grouped by user story. US2 (configured path) is foundational to US1 (persistence), so it is implemented first despite having lower spec priority. This is an implementation dependency, not a value re-ordering.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3) from spec.md

---

## Phase 1: Setup

**Purpose**: Package and repository infrastructure that must be in place before any code changes.

- [ ] T001 In `backend/cms/OpenCMS.CMS.Infrastructure/OpenCMS.CMS.Infrastructure.csproj`, remove `<PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" />` and add `<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" />`
- [ ] T002 [P] Add `backend/data/` to `.gitignore` at the repository root so the SQLite database file is never committed

**Checkpoint**: `dotnet build` should fail after T001 (InMemory usages removed but Program.cs still references it) — this is expected and resolved in Phase 3.

---

## Phase 2: Foundational — Configured Path Infrastructure (US2 Blocking Work)

**Purpose**: Connection string configuration and the shared service registration class that both APIs will use. MUST be complete before Phase 3 can proceed.

**⚠️ CRITICAL**: Phases 3 and 4 depend on this phase being complete.

- [ ] T003 [P] [US2] In `backend/cms/OpenCMS.CMS.AgentApi/appsettings.json`, add a `ConnectionStrings` section: `"DefaultConnection": "Data Source=../../data/opencms.db"`
- [ ] T004 [P] [US2] In `backend/cms/OpenCMS.CMS.ClientApi/appsettings.json`, add the same `ConnectionStrings` section: `"DefaultConnection": "Data Source=../../data/opencms.db"`
- [ ] T005 [US2] Create `backend/cms/OpenCMS.CMS.Infrastructure/Configurations/InfrastructureServiceRegistration.cs` with a static `AddInfrastructureServices(this IServiceCollection, IConfiguration, IWebHostEnvironment)` extension method that: (1) reads `ConnectionStrings:DefaultConnection`, (2) resolves the `Data Source` path to an absolute path using `Path.GetFullPath(Path.Combine(environment.ContentRootPath, dataSourceValue))`, (3) calls `Directory.CreateDirectory` on the parent directory, (4) registers `AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt => opt.UseSqlite(connectionString))`

**Checkpoint**: `dotnet build` should succeed after T005 (new file compiles, but Program.cs still uses old registration).

---

## Phase 3: User Story 1 — Application Persists Data Across Restarts (Priority: P1) 🎯 MVP

**Goal**: Both APIs connect to the shared SQLite file; data written by either API survives a full restart.

**Independent Test**: Start AgentApi, verify seed data is present via any GET endpoint. Stop AgentApi, restart it, verify the same data is still returned (not re-seeded from scratch).

- [ ] T006 [US1] Update `backend/cms/OpenCMS.CMS.AgentApi/Program.cs`: replace `builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt => opt.UseInMemoryDatabase("OpenCMS"))` with `builder.Services.AddInfrastructureServices(builder.Configuration, builder.Environment)`. Then replace the inline `Seeder.SeedOperationVersion1(...)` startup call with a scoped block that calls `context.Database.EnsureCreated()`, then `context.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;")`, then `Seeder.SeedOperationVersion1(context)`
- [ ] T007 [P] [US1] Apply the identical Program.cs change to `backend/cms/OpenCMS.CMS.ClientApi/Program.cs`

**Checkpoint**: `dotnet build` succeeds. Running either API for the first time creates `backend/data/opencms.db`. Stopping and restarting retains all data.

---

## Phase 4: User Story 3 — Database Schema Initialized with Seed Data (Priority: P3)

**Goal**: Both APIs can start against the same database without primary key conflicts on seed records. Seeding runs only once regardless of how many times either API restarts.

**Independent Test**: Start AgentApi (seeds DB). Start ClientApi. Verify no exceptions and no duplicate agent/operation records in the database. Restart both — data intact, no duplicates.

- [ ] T008 [US3] In `backend/cms/OpenCMS.CMS.Infrastructure/Persistence/Seeder.cs`, add `if (context.Agents.Any()) return;` as the first line of `SeedOperationVersion1` to make seeding idempotent and safe for concurrent dual-API startup

**Checkpoint**: Both APIs can start simultaneously against the same `opencms.db` without throwing primary key violations. Restarting either API multiple times produces no duplicate records.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Keep documentation in sync and verify the full build after all changes.

- [ ] T009 [P] Update `backend/CLAUDE.md`: in the Architecture section replace "EF Core DbContext (in-memory), seeder" with "EF Core DbContext (SQLite, `backend/data/opencms.db`), seeder" and update the inline code comment about `UseInMemoryDatabase`
- [ ] T010 Run `dotnet build` from `backend/` and confirm zero errors and zero warnings related to the InMemory package or missing usings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 complete — BLOCKS Phases 3 and 4
- **Phase 3 (US1)**: Depends on Phase 2 complete
- **Phase 4 (US3)**: Depends on Phase 3 complete (needs a working SQLite connection to test idempotency)
- **Phase 5 (Polish)**: Depends on all implementation phases complete

### User Story Dependencies

- **US2 (Configured Path)** — Phase 2: No story dependencies; blocks US1
- **US1 (Persistence)** — Phase 3: Depends on US2 (path config must exist before SQLite can connect)
- **US3 (Seeding)** — Phase 4: Depends on US1 (need live SQLite connection to verify idempotency)

### Within Each Phase

- T003 and T004 are parallel (different appsettings.json files, no conflict)
- T006 and T007 are parallel after T005 (different Program.cs files)
- T009 is parallel to T010 (different files)

### Parallel Opportunities

```bash
# Phase 2: run T003 and T004 together
Task T003: Add connection string to AgentApi/appsettings.json
Task T004: Add connection string to ClientApi/appsettings.json

# Phase 3: run T006 and T007 together (after T005)
Task T006: Update AgentApi/Program.cs
Task T007: Update ClientApi/Program.cs
```

---

## Implementation Strategy

### MVP First (US1 only — full persistence working)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Complete Phase 3: US1 Persistence (T006, T007)
4. **STOP and VALIDATE**: Start both APIs, confirm `backend/data/opencms.db` is created, data persists across restart
5. Complete Phase 4: US3 Seeding (T008) — prevents dual-startup conflict
6. Complete Phase 5: Polish (T009, T010)

### Notes

- US2 (database file in configured location) is implemented before US1 even though it has lower spec priority — the path configuration is a prerequisite for any SQLite connection
- No test projects exist; validation is done by running the APIs and observing behavior per each checkpoint
- The `backend/data/` directory is git-ignored; each developer gets their own local database on first run
