# Research: Custom Result Pattern

All findings are from codebase analysis. No external dependencies needed.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| File placement | `Configurations/Results.cs` | Already globally imported namespace — zero extra `using` directives |
| Implicit operators | Yes — from `T` and from `Error` | `return Error.NotFound(...)` reads as English; `T` and `Error` are always distinct types so no ambiguity |
| Error type | `record Error(string Code)` — code only, no message | Code alone is sufficient; removing `Message` keeps the type minimal and avoids free-text inconsistencies |
| HTTP mapping | Extension method `ToHttpResult()` co-located in `Results.cs` | Single mapping location for all 20+ endpoints; error code is the sole error payload in `ApiResponse` |
| Non-generic `Result` | Included | Covers void operations; no extra complexity |
| Migration scope | All handlers (nullable and non-nullable) | Consistency across slices; implicit operators make non-nullable migration trivial |
| Constitution deviation | Supersedes "return null for not-found" in B-II | Justified — null cannot carry error category; tracked in Complexity Tracking |
