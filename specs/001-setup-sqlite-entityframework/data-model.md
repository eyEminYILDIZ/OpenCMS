# Data Model: Setup SQLite with Entity Framework

**Branch**: `001-setup-sqlite-entityframework` | **Date**: 2026-05-22

> No schema changes are required by this feature. The entity model is unchanged; only the storage provider changes from InMemory to SQLite.

---

## Existing Entity Hierarchy

```
CoreEntity
  └── BaseEntity (adds: CreatedAt, UpdatedAt, DeletedAt)
        ├── Agent
        ├── Asset
        ├── Operation
        ├── OperationAsset
        └── Order
```

All entities use `Guid` primary keys set at construction time (no database-generated keys).

---

## Entities

### Agent
| Field | Type | Notes |
|---|---|---|
| Id | Guid (PK) | Inherited from CoreEntity |
| Name | string | |
| CreatedAt / UpdatedAt / DeletedAt | DateTime? | Inherited from BaseEntity |

### Asset
| Field | Type | Notes |
|---|---|---|
| Id | Guid (PK) | |
| Name | string | |
| AssetType | AssetTypes (enum) | |
| RelatedAgentId | Guid? (FK → Agent) | Nullable |

### Operation
| Field | Type | Notes |
|---|---|---|
| Id | Guid (PK) | |
| Name | string | |
| OperationType | OperationType (enum) | |
| OperationStatus | OperationStatus (enum) | |
| OperationAssets | List\<OperationAsset\> | Navigation |
| Orders | List\<Order\> | Navigation |

### OperationAsset
| Field | Type | Notes |
|---|---|---|
| Id | Guid (PK) | |
| AssetId | Guid (FK → Asset) | |
| OperationId | Guid (FK → Operation) | (EF convention) |

### Order
| Field | Type | Notes |
|---|---|---|
| Id | Guid (PK) | |
| Description | string | |
| OrderStatus | OrderStatus (enum) | |
| OrderType | OrderTypes (enum) | |
| ResponsibleOperationAssetId | Guid (FK → OperationAsset) | |
| TargetOperationAssetId | Guid? (FK → OperationAsset) | Nullable |
| NextOrderId | Guid? (FK → Order, self-ref) | OnDelete: SetNull |
| PreviousOrderId | Guid? (FK → Order, self-ref) | OnDelete: SetNull |
| TargetDatePeriodStart / End | DateTime | |
| TargetPointLatitude / Longitude / Altitude / Heading / Speed | double | |

---

## SQLite Compatibility Notes

### Self-Referencing Relationships on Order
`ApplicationDbContext.OnModelCreating` already configures `OnDelete(DeleteBehavior.SetNull)` for `NextOrderId` and `PreviousOrderId`. This is required for SQLite which does not support cascading deletes on self-referencing FKs by default. No change needed.

### Enum Storage
EF Core stores enums as integers by default — compatible with SQLite.

### DateTime Storage
SQLite stores dates as TEXT (ISO 8601) or REAL. EF Core's SQLite provider handles this transparently for `DateTime` properties. No change needed.

### Guid Storage
SQLite stores GUIDs as TEXT (36-char). EF Core's SQLite provider handles conversion. No change needed.

---

## WAL Mode

SQLite's Write-Ahead Log mode is enabled at connection open time via:
```sql
PRAGMA journal_mode=WAL;
```

This is set once via `context.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;")` after `EnsureCreated()` completes. WAL mode persists in the database file across connections — subsequent app starts do not need to re-set it.
