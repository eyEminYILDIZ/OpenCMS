using MediatR;
using Microsoft.EntityFrameworkCore;
using OpenCMS.CMS.Infrastructure.Persistence;
using OpenCMS.CMS.Infrastructure;
using OpenCMS.CMS.Application.Configurations;
using OpenCMS.CMS.Application.Configurations.Routes;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddMediatR(o => o.RegisterServicesFromAssembly(typeof(OpenCMS.CMS.Application.Agents.Self.ListAll.Query).Assembly));

builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt =>
    opt.UseInMemoryDatabase("OpenCMS"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

Seeder.Seed(app.Services.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>());

app.UseHttpsRedirection();


// register agent endpoint
RegisterRoutes.MapRoutes(app);

app.Run();
