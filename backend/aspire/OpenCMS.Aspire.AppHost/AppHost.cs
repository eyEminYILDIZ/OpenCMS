var builder = DistributedApplication.CreateBuilder(args);

// CMS Side
var clientApi = builder.AddProject<Projects.OpenCMS_CMS_ClientApi>("client-api")
    .WithHttpEndpoint(port: 5020);

builder.AddNpmApp("webapp", "../../../webapp", scriptName: "start")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithReference(clientApi)
    .WaitFor(clientApi);

// Agent Side
var agentApi = builder.AddProject<Projects.OpenCMS_CMS_AgentApi>("agent-api")
    .WithHttpEndpoint(port: 5010)
    .WithReference(clientApi)
    .WaitFor(clientApi);

builder.AddProject<Projects.OpenCMS_Agent_AirRadar>("air-radar")
    .WithReference(agentApi)
    .WaitFor(agentApi);

builder.AddProject<Projects.OpenCMS_Agent_AirDefenceGun>("air-defence-gun")
    .WithReference(agentApi)
    .WaitFor(agentApi);

builder.Build().Run();
