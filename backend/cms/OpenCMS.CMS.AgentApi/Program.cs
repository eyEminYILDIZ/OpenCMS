using Microsoft.EntityFrameworkCore;
using OpenCMS.CMS.AgentApi;
using OpenCMS.CMS.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseInMemoryDatabase("OpenCMS"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

Seeder.SeedAgents(app.Services.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>());

app.UseHttpsRedirection();


app.MapGet("/agents", (ApplicationDbContext context) =>
{
    return context.Agents.ToList();
})
.WithName("agents");

app.Run();
