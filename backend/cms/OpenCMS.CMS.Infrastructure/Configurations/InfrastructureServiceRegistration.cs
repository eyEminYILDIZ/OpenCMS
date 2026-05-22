using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenCMS.CMS.Application.Configurations;
using OpenCMS.CMS.Infrastructure.Persistence;

namespace OpenCMS.CMS.Infrastructure.Configurations;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration,
        string contentRootPath)
    {
        var rawConnectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Data Source=../../data/opencms.db";

        var dataSourceValue = rawConnectionString.Replace("Data Source=", string.Empty).Trim();
        var absoluteDbPath = Path.GetFullPath(Path.Combine(contentRootPath, dataSourceValue));
        Directory.CreateDirectory(Path.GetDirectoryName(absoluteDbPath)!);

        var connectionString = $"Data Source={absoluteDbPath}";

        services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(opt =>
            opt.UseSqlite(connectionString));

        return services;
    }
}
