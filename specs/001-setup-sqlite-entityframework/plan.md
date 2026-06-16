# Implementation Plan: Setup SQLite with Entity Framework

**Branch**: `001-setup-sqlite-entityframework` | **Date**: 2026-05-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-setup-sqlite-entityframework/spec.md`

## Summary

Replace the EF Core InMemory provider with SQLite so that both ClientApi and AgentApi share a single persistent database file. The change is confined to the Infrastructure project and the two API `Program.cs` files. No new features, endpoints, or entities are added; no schema changes are required. WAL mode is enabled so both APIs can access the shared file concurrently without blocking.

## Technical Context

**Language/Version**: C# 13 / .NET 10

**Primary Dependencies**: ASP.NET Core Minimal API, EF Core (SQLite provider replaces InMemory), MediatR, FluentValidation

**Storage**: SQLite — single file at `backend/cms_data/opencms.db`, shared by both APIs

**Testing**: No test projects exist

**Target Platform**: Linux / Windows server (local development + Aspire-orchestrated)

**Project Type**: Two ASP.NET Core Minimal API services (ClientApi port 5020, AgentApi port 5010) sharing a common Application + Infrastructure layer

**Performance Goals**: Standard web API expectations; WAL mode ensures concurrent reads from both APIs without write-blocking

**Constraints**: Both APIs must read from and write to the same database file. Seeder must be idempotent — both APIs seed at startup.

**Scale/Scope**: Single-node, development-stage; no replication or migration history required at this point

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| **I. Simplicity First** | PASS | `EnsureCreated()` over migrations; single extension method over duplicated inline setup; no new abstractions beyond what's needed |
| **II. Readable Code** | PASS | New `AddInfrastructureServices` method follows existing `AddApplicationServices` naming convention; self-describing |
| **III. SOLID** | PASS | D: DbContext registered via DI, injected into handlers. S: InfrastructureServiceRegistration has one reason to change. |
| **B-I. Vertical Slice** | PASS | No new features/slices needed; change is purely in Infrastructure and Program.cs |
| **B-II. CQRS** | PASS | No command/query changes |
| **B-III. Validation** | PASS | No new inputs |
| **B-IV. Domain Model Integrity** | PASS | No entity changes |
| **B-V. API Contracts** | PASS | No endpoint or HTTP contract changes |

*Post-design re-check: all gates still pass. The design introduces one new file (`InfrastructureServiceRegistration.cs`) and modifies five existing files. No principle is violated.*

## Project Structure

### Documentation (this feature)

```text
specs/001-setup-sqlite-entityframework/
├── plan.md              ← this file
├── research.md          ← Phase 0 decisions
├── data-model.md        ← Phase 1 entity reference + SQLite notes
├── quickstart.md        ← Phase 1 dev runbook
└── tasks.md             ← Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (affected files)

```text
backend/
├── data/                          ← NEW: created at runtime (gitignore this dir)
│   └── opencms.db                 ← NEW: SQLite database file (gitignored)
└── cms/
    ├── OpenCMS.CMS.Infrastructure/
    │   ├── OpenCMS.CMS.Infrastructure.csproj   MODIFIED: swap InMemory → Sqlite package
    │   ├── Configurations/
    │   │   └── InfrastructureServiceRegistration.cs   NEW: AddInfrastructureServices()
    │   └── Persistence/
    │       ├── ApplicationDbContext.cs          NO CHANGE (model unchanged)
    │       └── Seeder.cs                        MODIFIED: idempotent guards
    ├── OpenCMS.CMS.AgentApi/
    │   ├── Program.cs                           MODIFIED: use AddInfrastructureServices
    │   └── appsettings.json                     MODIFIED: add ConnectionStrings
    └── OpenCMS.CMS.ClientApi/
        ├── Program.cs                           MODIFIED: use AddInfrastructureServices
        └── appsettings.json                     MODIFIED: add ConnectionStrings
```

## Implementation Details

### 1. Package Swap — `OpenCMS.CMS.Infrastructure.csproj`

Remove `Microsoft.EntityFrameworkCore.InMemory`, add `Microsoft.EntityFrameworkCore.Sqlite`.

### 2. Connection String — Both `appsettings.json` files

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=../../cms_data/opencms.db"
  }
}
```

The relative path resolves to `backend/cms_data/opencms.db` from both API project directories when run via `dotnet run`.

### 3. New: `InfrastructureServiceRegistration.cs`

```csharp
// backend/cms/OpenCMS.CMS.Infrastructure/Configurations/InfrastructureServiceRegistration.cs

public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services,
    IConfiguration configuration,
    IWebHostEnvironment environment)
{
    var relativePath = configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=../../cms_data/opencms.db";

    // Resolve the Data Source path to absolute, relative to content root
    var dataSourceValue = relativePath.Replace("Data Source=", "").Trim();
    var absoluteDbPath = Path.GetFullPath(
        Path.Combine(environment.ContentRootPath, dataSourceValue));
    Directory.CreateDirectory(Path.GetDirectoryName(absoluteDbPath)!);

    var connectionString = $"Data Source={absoluteDbPath}";

    services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt =>
        opt.UseSqlite(connectionString));

    return services;
}
```

### 4. Database Initialization at Startup — Both `Program.cs` files

After `builder.Build()`, before the app runs:

```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    context.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    Seeder.SeedOperationVersion1(context);
}
```

Replace the current inline `AddDbContext` + startup seeder calls with `AddInfrastructureServices` + the block above.

### 5. Idempotent Seeder — `Seeder.cs`

Wrap each `AddRange` + `SaveChanges` block with a guard:

```csharp
public static void SeedOperationVersion1(ApplicationDbContext context)
{
    if (context.Agents.Any()) return;   // already seeded

    // ... rest of the method unchanged ...
}
```

A single top-level guard on `Agents` is sufficient since all seed data is inserted together in one invocation.

### 6. Gitignore — `backend/data/`

Add to the root `.gitignore` (or `backend/.gitignore`):

```
backend/data/
```

## Complexity Tracking

> No constitution violations; this table is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| — | — | — |
