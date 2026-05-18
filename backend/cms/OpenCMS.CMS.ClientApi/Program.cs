using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplicationServices();

builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt =>
    opt.UseInMemoryDatabase("OpenCMS"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

Seeder.SeedOperationVersion1(app.Services.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>());

app.UseApplicationExceptionHandling();
app.UseHttpsRedirection();


// register agent endpoint
RegisterRoutes.MapRoutes(app, Assembly.GetAssembly(typeof(OpenCMS.CMS.Application.Configurations.Interfaces.IAgentEndpoint)));

app.Run();
