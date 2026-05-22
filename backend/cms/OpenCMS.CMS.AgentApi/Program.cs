var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration, builder.Environment.ContentRootPath);

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


// register agent endpoint
RegisterRoutes.MapRoutes(app, Assembly.GetAssembly(typeof(OpenCMS.CMS.Application.Configurations.Interfaces.IAgentEndpoint)));

app.Run();
