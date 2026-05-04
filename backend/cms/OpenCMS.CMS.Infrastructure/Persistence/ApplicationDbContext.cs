using Microsoft.EntityFrameworkCore;
using OpenCMS.CMS.Domain.Entities;
using OpenCMS.CMS.Application.Configurations;

namespace OpenCMS.CMS.Infrastructure;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Agent> Agents { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<Operation> Operations { get; set; }
    public DbSet<OperationAsset> OperationAssets { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.NextOrder)
            .WithMany()
            .HasForeignKey(o => o.NextOrderId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.PreviousOrder)
            .WithMany()
            .HasForeignKey(o => o.PreviousOrderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
