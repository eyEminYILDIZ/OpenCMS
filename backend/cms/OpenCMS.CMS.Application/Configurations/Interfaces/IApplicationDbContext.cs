using Microsoft.EntityFrameworkCore;
using OpenCMS.CMS.Domain.Entities;

namespace OpenCMS.CMS.Application.Configurations;

public interface IApplicationDbContext
{
    DbSet<Agent> Agents { get; set; }
    DbSet<Asset> Assets { get; set; }
    DbSet<Dispatch> Dispatches { get; set; }
    DbSet<Operation> Operations { get; set; }
    DbSet<OperationAsset> OperationAssets { get; set; }
    DbSet<Order> Orders { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
