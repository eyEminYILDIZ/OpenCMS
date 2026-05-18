using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using OpenCMS.CMS.Application.Configurations.Behaviors;
using OpenCMS.CMS.Application.Configurations.Exceptions;

namespace OpenCMS.CMS.Application.Configurations;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = typeof(ApplicationServiceRegistration).Assembly;

        services.AddMediatR(o =>
        {
            o.RegisterServicesFromAssembly(assembly);
            o.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(assembly);
        services.AddExceptionHandler<ValidationExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }

    public static IApplicationBuilder UseApplicationExceptionHandling(this IApplicationBuilder app)
    {
        app.UseExceptionHandler();
        return app;
    }
}
