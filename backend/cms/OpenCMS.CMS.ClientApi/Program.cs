using OpenCMS.CMS.Application.Configurations.Interfaces;
using OpenCMS.CMS.ClientApi.Hubs;
using OpenCMS.CMS.ClientApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration, builder.Environment.ContentRootPath);

builder.Services.AddSignalR();

// Registered as a singleton in its own right (not just via AddHostedService) so that
// AgentSocketService can inject the same instance and reuse its live HubConnection to AgentHub.
builder.Services.AddSingleton<AgentSocketClient>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<AgentSocketClient>());

builder.Services.AddSingleton<IAgentSocketService, AgentSocketService>();

// SignalR requires AllowCredentials, so we cannot use AllowAnyOrigin
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.SetIsOriginAllowed(_ => true).AllowAnyHeader().AllowAnyMethod().AllowCredentials());
    //         policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    context.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL;");
    Seeder.SeedOperationVersion1(context);
}

app.UseApplicationExceptionHandling();
app.UseHttpsRedirection();
app.UseCors();

// register agent endpoint
RegisterRoutes.MapRoutes(app, Assembly.GetAssembly(typeof(OpenCMS.CMS.Application.Configurations.Interfaces.IClientEndpoint)));

app.MapHub<ClientHub>("/hubs/clients");

app.Run();
