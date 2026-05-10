# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
dotnet build

# Run AgentApi (port 5010)
dotnet run --project cms/OpenCMS.CMS.AgentApi

# Run ClientApi (port 5020)
dotnet run --project cms/OpenCMS.CMS.ClientApi
```

No test projects exist yet.

## Architecture

.NET 10 backend using **Vertical Slice Architecture + CQRS via MediatR**. Two APIs share a common Application and Infrastructure layer:

```
/agent/          — Console apps that integrate with the CMS via Agent.Library
/cms/
  AgentApi       — ASP.NET Core minimal API, port 5010
  ClientApi      — ASP.NET Core minimal API, port 5020
  Application    — Features, commands, queries, endpoints, route registration
  Domain         — Entities, enums (no dependencies)
  Infrastructure — EF Core DbContext (in-memory), seeder
```

**Feature folder layout** (every feature follows this pattern):

```
Features/{Feature}/_Self/{Operation}/
  Endpoint.cs   — registers the route, calls mediator.Send()
  Command.cs    — IRequest<T> for writes  /  Query.cs for reads
  Handler.cs    — IRequestHandler<TRequest, TResponse>
```

MediatR handlers are auto-registered from the Application assembly. DbContext is registered as an in-memory database (`"OpenCMS"`); `Seeder.Seed()` runs at startup.

**Entity hierarchy:** `CoreEntity (Guid Id)` → `BaseEntity (timestamps)` → `Agent`, `Asset`, `Operation`, `OperationAsset`, `Order`.

## Endpoint conventions

- **Return entities directly.** Never use `Results.Ok()`, `Results.NotFound()`, `Results.NoContent()`, or any other `Results.*` helpers. Just `return` the entity or value from the endpoint lambda. Returning `null` is acceptable for not-found cases.

- **Register every new endpoint in `RegisterRoutes.cs`.** Endpoints are not discovered automatically. For every new endpoint add the corresponding `Endpoint.MapEndpoint(app)` call in the correct feature group section of `cms/OpenCMS.CMS.ClientApi/Routes/RegisterRoutes.cs`.

- **Add an HTTP example for every new endpoint.** For every new endpoint (ListAll, GetById, Create, Update, Delete) add a matching example request block to the relevant `_http/*.http` file in the ClientApi project (e.g. `Operations.http`, `Agents.http`, `Assets.http`).
