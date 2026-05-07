# OpenCMS Backend — Claude Code Guidelines

## Endpoint conventions

- **Return entities directly.** Never use `Results.Ok()`, `Results.NotFound()`, `Results.NoContent()`, or any other `Results.*` helpers. Just `return` the entity or value from the endpoint lambda. Returning `null` is acceptable for not-found cases.

- **Register every new endpoint in `RegisterRoutes.cs`.** Endpoints are not discovered automatically. For every new endpoint add the corresponding `Endpoint.MapEndpoint(app)` call in the correct feature group section of `cms/OpenCMS.CMS.Application/Configurations/Routes/RegisterRoutes.cs`.

- **Add an HTTP example for every new endpoint.** For every new endpoint (ListAll, GetById, Create, Update, Delete) add a matching example request block to the relevant `_http/*.http` file in the AgentApi project (e.g. `Operations.http`, `Agents.http`, `Assets.http`).
