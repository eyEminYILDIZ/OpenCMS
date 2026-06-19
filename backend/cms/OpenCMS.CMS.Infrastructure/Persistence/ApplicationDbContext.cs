using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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

        // Microsoft.Data.Sqlite stores Guid objects as UPPERCASE TEXT but EF Core's
        // default insert path uses lowercase strings — causing a case mismatch on query.
        // Explicit converters force consistent lowercase for both storage and query params.
        var guidConverter = new ValueConverter<Guid, string>(
            v => v.ToString("D"),
            v => Guid.Parse(v));
        var nullableGuidConverter = new ValueConverter<Guid?, string>(
            v => v.GetValueOrDefault().ToString("D"),
            v => string.IsNullOrEmpty(v) ? (Guid?)null : Guid.Parse(v));

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(Guid))
                    property.SetValueConverter(guidConverter);
                else if (property.ClrType == typeof(Guid?))
                    property.SetValueConverter(nullableGuidConverter);
            }
        }

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
