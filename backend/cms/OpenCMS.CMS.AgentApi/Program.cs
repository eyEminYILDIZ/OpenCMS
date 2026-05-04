using MediatR;
using Microsoft.EntityFrameworkCore;
using OpenCMS.CMS.AgentApi;
using OpenCMS.CMS.Infrastructure;
using OpenCMS.CMS.Application.Configurations;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddMediatR(o => o.RegisterServicesFromAssembly(typeof(OpenCMS.CMS.Application.Agents.ListAll.Query).Assembly));

builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt =>
    opt.UseInMemoryDatabase("OpenCMS"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

Seeder.SeedAgents(app.Services.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>());

app.UseHttpsRedirection();


app.MapGet("/agents", ([FromServices] ISender sender) =>
{
    var query = new OpenCMS.CMS.Application.Agents.ListAll.Query();
    System.Console.WriteLine(query.GetType().FullName);
    return sender.Send(query);
})
.WithName("agents");

app.MapPost("/agents", ([FromServices] ISender sender, [FromBody] OpenCMS.CMS.Application.Agents.Create.Command command) =>
{
    return sender.Send(command);
}).WithName("createAgent");

app.Run();
