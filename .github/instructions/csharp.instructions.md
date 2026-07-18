---
description: "C# coding conventions for OpenCMS backend. Applies to namespace declarations, style, and formatting rules for .cs files."
applyTo: "backend/**/*.cs"
---

# C# Conventions

- Always use **file-scoped namespaces**: `namespace OpenCMS.Foo.Bar;` followed by a newline.
  Never generate block-scoped namespaces with curly braces (`namespace Foo.Bar { ... }`).
- All `using` directives must be placed **before** the `namespace` declaration, at the top of the file.
  Never place `using` statements after the namespace declaration.

  ```csharp
  using System;
  using System.Collections.Generic;

  namespace OpenCMS.Foo.Bar;

  public class Example
  {
  }
  ```

- `ImplicitUsings` is `enable`d for all projects (see `Directory.Build.props`). Never add a `using` directive
  for a namespace that is already implicitly imported by the SDK — it is redundant.
  - Base set (all SDKs): `System`, `System.Collections.Generic`, `System.IO`, `System.Linq`,
    `System.Net.Http`, `System.Threading`, `System.Threading.Tasks`.
  - Only add an explicit `using` when the namespace is **not** covered by implicit usings
    (e.g. `System.Text.Json`, `Microsoft.EntityFrameworkCore`, project-specific namespaces).
