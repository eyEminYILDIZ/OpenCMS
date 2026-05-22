# Research: Setup SQLite with Entity Framework

**Branch**: `001-setup-sqlite-entityframework` | **Date**: 2026-05-22

---

## Decision 1: SQLite Concurrent Access (Two APIs)

**Decision**: Enable WAL (Write-Ahead Log) mode via a pragma on the SQLite connection.

**Rationale**: Both ClientApi and AgentApi connect to the same `.db` file. SQLite's default journal mode serializes all writes and blocks concurrent reads during a write. WAL mode decouples readers from the writer, allowing both APIs to read simultaneously while one writes. This is the standard SQLite recommendation for multi-reader scenarios.

**Configuration**: Add `Pragma journal_mode=WAL` to the connection string or set it once via `ExecuteSqlRaw` after `EnsureCreated()`.

**Alternatives considered**:
- Separate databases per API — rejected because both APIs must share the same data (Agent and Client operate on the same operations/assets).
- PostgreSQL or another server-based DB — rejected because the issue specifies SQLite and EF Core; this is a complexity increase not warranted at this stage.

---

## Decision 2: Schema Initialization — EnsureCreated vs Migrations

**Decision**: Use `context.Database.EnsureCreated()` at startup.

**Rationale**: There is no existing SQLite database to migrate from; the current storage is in-memory and ephemeral. `EnsureCreated()` creates the schema from the current model in one call, is idempotent (no-ops if the schema already exists), and requires no migration files. This is the simplest correct solution per the constitution's Simplicity First principle.

**Alternatives considered**:
- EF Core Migrations (`dotnet ef migrations add`) — adds migration files, a migrations history table, and an `Update-Database` workflow. Valuable when preserving existing data across schema changes. Not warranted here because there is no existing data and no schema evolution requirement at this stage.

---

## Decision 3: Database File Path

**Decision**: Store the path as a standard `ConnectionStrings:DefaultConnection` entry in `appsettings.json`. Resolve it to an absolute path at startup using `IWebHostEnvironment.ContentRootPath` so that both APIs resolve to the same file regardless of working directory.

**Path value**: `../../data/opencms.db`  
**Resolved from** `ContentRootPath` (project directory when using `dotnet run`):
- `backend/cms/OpenCMS.CMS.ClientApi/` + `../../data/opencms.db` → `backend/data/opencms.db`
- `backend/cms/OpenCMS.CMS.AgentApi/` + `../../data/opencms.db` → `backend/data/opencms.db`

Both APIs resolve to the same `backend/data/` directory.

**Directory creation**: The startup code creates the directory with `Directory.CreateDirectory()` before registering the DbContext — no manual setup required.

**Alternatives considered**:
- Absolute path hardcoded in appsettings — not portable across machines.
- Single `appsettings.Development.json` override with machine-specific path — extra config overhead.
- Path relative to solution root via an environment variable — unnecessary indirection when ContentRootPath suffices.

---

## Decision 4: Seeder Idempotency

**Decision**: Guard each seed block with an existence check on a known anchor record before inserting.

**Rationale**: Both APIs call `Seeder.SeedOperationVersion1()` at startup. With InMemory each process had its own isolated store; with a shared SQLite file, the second startup will hit a primary key violation on the hardcoded GUIDs. The fix is a single `Any()` check per entity group before `AddRange()`.

**Pattern**:
```csharp
if (!context.Agents.Any())
{
    context.Agents.AddRange(agents);
    context.SaveChanges();
}
```

This is safe because the seed GUIDs are deterministic and fixed.

**Alternatives considered**:
- `AddOrUpdate` (upsert) — heavier than needed; seed data is immutable reference data.
- Remove seeding from one API — both APIs are independent processes; either could start first, so both must be capable of seeding an empty database.

---

## Decision 5: NuGet Package Changes

**Decision**: In `OpenCMS.CMS.Infrastructure.csproj`:
- Remove `Microsoft.EntityFrameworkCore.InMemory`
- Add `Microsoft.EntityFrameworkCore.Sqlite`

**Rationale**: The InMemory provider is only needed for the database name string `"OpenCMS"` and serves no purpose once SQLite is in place. Keeping it would add a dead dependency.

**No version pinning needed**: The project uses `<PackageReference>` without explicit versions, relying on the SDK's central package management or implicit transitive resolution — consistent with existing project style.

---

## Decision 6: Service Registration Consolidation

**Decision**: Create `AddInfrastructureServices(IConfiguration, IWebHostEnvironment)` extension method in `OpenCMS.CMS.Infrastructure`.

**Rationale**: Both `Program.cs` files currently duplicate the `AddDbContext` call. Switching to SQLite adds path resolution and directory creation logic — duplicating that across two files violates DRY and increases maintenance surface. A single extension method is the minimal abstraction that eliminates the duplication. This follows the existing pattern already used for `AddApplicationServices()`.

**Alternatives considered**:
- Keep duplication in both `Program.cs` — acceptable for one line, not for 5–6 lines of path setup code.
- Configuration-only approach (no extension method) — would still require duplicated path resolution code.
