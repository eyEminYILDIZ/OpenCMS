# OpenCMS Backend

Backend parts of OpenCMS

## Baseline

- C# Language
- Dotnet Framework
- Aspnet Core WebApi
- Dotnet Console Application


## Architecture
- Vertical Slice Architecture
- Clean Architecture
- Domain Driven Design
- CQRS


## Libraries

- MediatR
- FluentValidation
- OpenTelemetry
- Microsoft.EntityFrameworkCore
- Microsoft.AspNetCore.OpenApi


## Other Features
- Minimal API
- Central package management
- Central property management
- XML (slnx) solution file
- Aspire
- Result Pattern

## Docs

- [Communication flow diagram](./_docs/communication-flows_v3.drawio)

## Projects

### OpenCMS.Aspire.AppHost

AppHost project uses for Aspire services.

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

### OpenCMS.Agent.AirRadar

Console application for example agent input flow demonstration.

### OpenCMS.Agent.AirDefenceGun

Console application for example agent output flow demonstration.

### OpenCMS.Agent.AutonomousDrone

Console application simulating an autonomous drone agent, combining sensor, actuator, and 3D world simulation with the flight computer and flight display libraries.

### OpenCMS.Libraries.ApiClient

Library project includes classes and other definitions for c# applications that integrates agents with CMS.

### OpenCMS.Libraries.Common

Library project with shared contracts and models (threat/asset/order types, waypoints, agent state, aircraft types) used across agent and CMS projects.

### OpenCMS.Libraries.FlightComputer

Library project implementing flight computer logic for autonomous agents, including auto-pilot, drone actuator abstractions, and coordinate calculations.

### OpenCMS.Libraries.FlightDisplay

Library project rendering console-based flight instruments (Primary Flight Display, Navigation Display) for agent applications.

### OpenCMS.Libraries.InputController

Library project for input devices, supporting keyboard input and joystick (Logitech Extreme 3D Pro) input with actuator mapping for drone control.


