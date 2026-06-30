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
builder.Services.AddHostedService<AgentSocketClient>();

// FAKE CLASS, CREAED FOR SURPASSING THE INTERFACE IMPLEMENTATION ERROR. DO NOT USE THIS CLASS.
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
