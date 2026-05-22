# Quickstart: SQLite Setup

After this feature is implemented, the in-memory database is replaced by a persistent SQLite file.

## Running the APIs

No additional setup is required. The `backend/data/` directory and `opencms.db` file are created automatically on first startup.

```bash
# From the backend/ directory

# Start AgentApi (port 5010)
dotnet run --project cms/OpenCMS.CMS.AgentApi

# Start ClientApi (port 5020) — in a separate terminal
dotnet run --project cms/OpenCMS.CMS.ClientApi
```

Both APIs connect to the same file: `backend/data/opencms.db`.

## Resetting the Database

To start fresh (e.g., reseed with clean data), delete the database file:

```bash
rm backend/data/opencms.db
```

On the next startup either API will recreate the schema and reseed automatically.

## Database File Location

```
backend/
└── data/
    └── opencms.db   ← shared by AgentApi and ClientApi
```

## Inspecting the Database

Use any SQLite browser (e.g., DB Browser for SQLite, TablePlus, or the `sqlite3` CLI):

```bash
sqlite3 backend/data/opencms.db
.tables
SELECT * FROM Agents;
.quit
```
