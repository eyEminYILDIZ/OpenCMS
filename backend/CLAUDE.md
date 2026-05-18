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
  Validator.cs  — AbstractValidator<Command> or AbstractValidator<Query> (when the class has properties)
```

MediatR handlers are auto-registered from the Application assembly. DbContext is registered as an in-memory database (`"OpenCMS"`); `Seeder.Seed()` runs at startup.

**Entity hierarchy:** `CoreEntity (Guid Id)` → `BaseEntity (timestamps)` → `Agent`, `Asset`, `Operation`, `OperationAsset`, `Order`.

## Validation conventions

- **Create a `Validator.cs` for every Command or Query that has properties/fields.** Place it in the same folder as the `Command.cs` or `Query.cs` it validates. Name the class `Validator` and inherit from `AbstractValidator<Command>` (or `AbstractValidator<Query>`).

- Validators are auto-discovered by the `ValidationBehavior` MediatR pipeline and run before the handler. You do not need to register them manually.

- **Do not create a `Validator.cs` for parameter-less commands/queries** (i.e., classes with no properties). A validator with no rules is unnecessary.

- Use FluentValidation rule methods (`.NotEmpty()`, `.MaximumLength()`, `.InclusiveBetween()`, `.IsInEnum()`, etc.) with `.WithMessage()` on every rule.

Example (`Validator.cs`):

```csharp
using FluentValidation;

namespace OpenCMS.CMS.Application.Features.{Feature}._Self.{Operation};

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.");
    }
}
```

Validation failures are caught by `ValidationBehavior<TRequest, TResponse>` and surfaced as HTTP 400 with `ValidationProblemDetails` via `ValidationExceptionHandler`.

## Endpoint conventions

- **Use response models, not entities.** Define a `CommandResponse` (for writes) or `QueryResponse` (for reads) record/class inside the existing `Command.cs` or `Query.cs` file — do not create a separate file. Use it as the handler's return type. Never return domain entities directly from endpoints. Never use `Results.Ok()`, `Results.NotFound()`, `Results.NoContent()`, or any other `Results.*` helpers. Just `return` the response model from the endpoint lambda. Returning `null` is acceptable for not-found cases.

- **Register every new endpoint in `RegisterRoutes.cs`.** Endpoints are not discovered automatically. For every new endpoint add the corresponding `Endpoint.MapEndpoint(app)` call in the correct feature group section of `cms/OpenCMS.CMS.ClientApi/Routes/RegisterRoutes.cs`.

- **Add an HTTP example for every new endpoint.** For every new endpoint (ListAll, GetById, Create, Update, Delete) add a matching example request block to the relevant `_http/*.http` file in the ClientApi project (e.g. `Operations.http`, `Agents.http`, `Assets.http`).
