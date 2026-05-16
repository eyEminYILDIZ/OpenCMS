using OpenCMS.CMS.Infrastructure;

namespace OpenCMS.CMS.Infrastructure.Persistence;

public class Seeder
{
    public static void SeedOperationVersion1(ApplicationDbContext context)
    {
        var agents = new[]
        {
            new Domain.Entities.Agent { Id = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6"), Name = "AirRadar Agent" },
            new Domain.Entities.Agent { Id = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e23"), Name = "AirDefenceGun Agent" },
        };

        context.Agents.AddRange(agents);
        context.SaveChanges();

        var assets = new[]
        {
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23"), Name = "AirRadar Asset", AssetType = Domain.Entities.AssetTypes.Vehicle, RelatedAgentId=Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6") },
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24"), Name = "AirDefenceGun Asset", AssetType = Domain.Entities.AssetTypes.Vehicle, RelatedAgentId=Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e23") },
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25"), Name = "Hostile Aircraft", AssetType = Domain.Entities.AssetTypes.Aircraft },
        };

        context.Assets.AddRange(assets);
        context.SaveChanges();

        var operation = new Domain.Entities.Operation
        {
            Id = Guid.Parse("a394835f-ce35-4e6b-8cd7-7e553def2e45"),
            Name = "Hostile Aircraft Interception - a394835f",
            OperationType = Domain.Entities.OperationType.Intercept,
            OperationStatus = Domain.Entities.OperationStatus.InProgress,
            Assets = new List<Domain.Entities.OperationAsset>
            {
                // air radar
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23") },
                // air defence gun
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e45"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24") },
                // hostile aircraft
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25") }
            },
            Orders = new List<Domain.Entities.Order>
            {
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e55"),
                    Description = "AirDefenceGun - Shut down the Hostile Aircraft",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Attack,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e45"),
                    TargetAssetId=Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:00:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetPointLatitude=41.045524,
                    TargetPointLongitude=29.064697,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
            }
        };

        context.Operations.AddRange(operation);
        context.SaveChanges();
    }



    public static void SeedOperationVersion2(ApplicationDbContext context)
    {
        var agents = new[]
        {
            new Domain.Entities.Agent { Id = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e23"), Name = "Agent A" },
            new Domain.Entities.Agent { Id = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e24"), Name = "Agent B" },
            new Domain.Entities.Agent { Id = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e25"), Name = "Agent C" },
            new Domain.Entities.Agent { Id = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6"), Name = "Air Radar" },
        };

        context.Agents.AddRange(agents);
        context.SaveChanges();

        var assets = new[]
        {
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23"), Name = "Field Agent 1001", AssetType = Domain.Entities.AssetTypes.Person },
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24"), Name = "Field Agent 2002", AssetType = Domain.Entities.AssetTypes.Person },
            new Domain.Entities.Asset { Id = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25"), Name = "Secret Yacht 3003", AssetType = Domain.Entities.AssetTypes.Ship },
        };

        context.Assets.AddRange(assets);
        context.SaveChanges();

        var operation = new Domain.Entities.Operation
        {
            Id = Guid.Parse("a394835f-ce35-4e6b-8cd7-7e553def2e44"),
            Name = "Getting X11 item to headquarter",
            OperationType = Domain.Entities.OperationType.Exchange,
            OperationStatus = Domain.Entities.OperationStatus.NotStarted,
            Assets = new List<Domain.Entities.OperationAsset>
            {
                // field agent 1001
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23") },
                // field agent 2002
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e45"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24") },
                // secret yacht 3003
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"), AssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25") }
            },
            Orders = new List<Domain.Entities.Order>
            {
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e55"),
                    Description = "Field Agent 1001 - Move to Location P1",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Move,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:00:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetPointLatitude=41.045524,
                    TargetPointLongitude=29.064697,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e56"),
                    Description = "Field Agent 1001 - Take X11 Item from Location P1",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Take,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:10:00Z"),
                    TargetPointLatitude=-1,
                    TargetPointLongitude=-1,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e57"),
                    Description = "Field Agent 1001 - Move to Location P2",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Move,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:30:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:35:00Z"),
                    TargetPointLatitude=41.048350,
                    TargetPointLongitude=29.052079,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e58"),
                    Description = "Field Agent 1001 - Give X11 Item to Secret Yacht 3003 at Location P2",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Give,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:35:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:40:00Z"),
                    TargetPointLatitude=-1,
                    TargetPointLongitude=-1,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                /////////
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e59"),
                    Description = "Secret Yacht 3003 - Move to Location P2",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Move,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:30:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:35:00Z"),
                    TargetPointLatitude=41.048350,
                    TargetPointLongitude=29.052079,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e60"),
                    Description = "Secret Yacht 3003 - Take X11 Item to Secret Yacht 3003 at Location P2",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Take,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:35:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:40:00Z"),
                    TargetPointLatitude=-1,
                    TargetPointLongitude=-1,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e61"),
                    Description = "Secret Yacht 3003 - Move to Location P0-Headquarter",
                    OrderStatus = Domain.Entities.OrderStatus.Active,
                    OrderType = Domain.Entities.OrderTypes.Move,
                    ResponsibleAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:30:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:35:00Z"),
                    TargetPointLatitude=41.066871,
                    TargetPointLongitude=29.043388,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
            }
        };

        context.Operations.AddRange(operation);
        context.SaveChanges();
    }

}