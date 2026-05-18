var builder = DistributedApplication.CreateBuilder(args);

var agentApi = builder.AddProject<Projects.OpenCMS_CMS_AgentApi>("agent-api")
    .WithHttpEndpoint(port: 5010);

builder.AddProject<Projects.OpenCMS_CMS_ClientApi>("client-api")
    .WithHttpEndpoint(port: 5020);

builder.AddProject<Projects.OpenCMS_Agent_AirRadar>("air-radar")
    .WithReference(agentApi)
    .WaitFor(agentApi);

builder.AddProject<Projects.OpenCMS_Agent_AirDefenceGun>("air-defence-gun")
    .WithReference(agentApi)
    .WaitFor(agentApi);

builder.Build().Run();
