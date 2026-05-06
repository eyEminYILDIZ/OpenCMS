# OpenCMS Backend

## Architecture
- Vertical Slice Architecture
- Clean Architecture
- Domain Driven Design

## Libraries

- MediatR
- Microsoft.EntityFrameworkCore
- Microsoft.AspNetCore.OpenApi


## Other Features
- Minimal API
- Central package management
- Central property management
- XML (slnx) solution file

## Projects

### OpenCMS.CMS.AgentApi

AgentApi serves CMS application for Agent applications like radars, personal phones, missiles etc.

### OpenCMS.CMS.ClientApi

ClientApi serves CMS application for Web and Mobile clients for platform management like creating operations, view situation, make decisions etc.

### OpenCMS.CMS.Domain

Includes entities and domain logics.

### OpenCMS.CMS.Application

Includes application flows as command and queries.

### OpenCMS.CMS.Infrastructure

Includes persistence and other external layers.

### OpenCMS.Agent.Library

Library project includes classes and other definitions for c# applications that integrates agents with CMS.

### OpenCMS.Agent.AirRadar

Console application for example agent input flow demonstration.

### OpenCMS.Agent.AirDefenceGun

Console application for example agent output flow demonstration.


