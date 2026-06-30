using OpenCMS.CMS.AgentApi.Hubs;
using OpenCMS.CMS.AgentApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration, builder.Environment.ContentRootPath);

builder.Services.AddSignalR();
builder.Services.AddScoped<IAgentSocketService, AgentSocketService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
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
RegisterRoutes.MapRoutes(app, Assembly.GetAssembly(typeof(OpenCMS.CMS.Application.Configurations.Interfaces.IAgentEndpoint)));

app.MapHub<AgentHub>("/hubs/agents");

app.Run();
