using OpenCMS.CMS.Infrastructure;

namespace OpenCMS.CMS.Infrastructure.Persistence;

public class Seeder
{
    public static void Seed(ApplicationDbContext context)
    {
        SeedBaseData(context);
        SeedOperation1(context);
        SeedOperation2(context);
    }

    // web user
    private static readonly Guid WebUserAgentId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e21");
    private static readonly Guid WebUserAssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e22");

    // mobile operator
    private static readonly Guid MobileOperatorAgentId = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e42");
    private static readonly Guid MobileOperatorAssetId = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e43");

    private static readonly Guid AirRadarAgentId = Guid.Parse("3071ea39-56ef-42f8-a6fd-9f3d3b4ebdf6");
    private static readonly Guid AirDefenceGunAgentId = Guid.Parse("b394835f-ce35-4e6b-8cd7-7e553def2e23");
    private static readonly Guid AirRadarAssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e23");
    private static readonly Guid AirDefenceGunAssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e24");
    private static readonly Guid HostileAircraftAssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e25");
    private static readonly Guid HeadquarterAssetId = Guid.Parse("8e1a6d78-9746-4522-b437-8c14562fa2e1");

    private static readonly Guid AutonomusDroneAgentId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e26");
    private static readonly Guid AutonomusDroneAssetId = Guid.Parse("c394835f-ce35-4e6b-8cd7-7e553def2e27");

    public static void SeedBaseData(ApplicationDbContext context)
    {
        if (context.Agents.Any())
            return;

        var agents = new[]
        {
            new Domain.Entities.Agent { Id = AirRadarAgentId, Name = "AirRadar Agent" },
            new Domain.Entities.Agent { Id = AirDefenceGunAgentId, Name = "AirDefenceGun Agent" },
            new Domain.Entities.Agent { Id = AutonomusDroneAgentId, Name = "AutonomusDrone Agent" },
            new Domain.Entities.Agent { Id = WebUserAgentId, Name = "Web User Agent" },
            new Domain.Entities.Agent { Id = MobileOperatorAgentId, Name = "Mobile Operator Agent" }
        };

        context.Agents.AddRange(agents);
        context.SaveChanges();

        var assets = new[]
        {
            new Domain.Entities.Asset { Id = AirRadarAssetId,        Latitude= 41.01634785560995, Longitude= 28.98623880475428, Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "AirRadar Asset", AssetType = Domain.Entities.AssetTypes.Radar, RelatedAgentId=AirRadarAgentId },
            new Domain.Entities.Asset { Id = AirDefenceGunAssetId,   Latitude= 41.02227746726299, Longitude= 29.00685808982585, Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "AirDefenceGun Asset", AssetType = Domain.Entities.AssetTypes.AirGun, RelatedAgentId=AirDefenceGunAgentId },
            new Domain.Entities.Asset { Id = HostileAircraftAssetId, Latitude= 41.11767346658533, Longitude= 28.97005054896966, Altitude=1000,ThreatType=Domain.Entities.ThreatTypes.Hostile,   Name = "Hostile Aircraft", AssetType = Domain.Entities.AssetTypes.Aircraft },
            new Domain.Entities.Asset { Id = HeadquarterAssetId,     Latitude= 41.02111528816589, Longitude= 29.00411507182091, Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "Headquarter", AssetType = Domain.Entities.AssetTypes.Building },
            new Domain.Entities.Asset { Id = AutonomusDroneAssetId,  Latitude= 40.87435363993733, Longitude= 29.24112664796528, Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "Autonomus Drone", AssetType = Domain.Entities.AssetTypes.Drone, RelatedAgentId=AutonomusDroneAgentId },
            new Domain.Entities.Asset { Id = WebUserAssetId,         Latitude= 0,                 Longitude= 0,                 Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "Web User", AssetType = Domain.Entities.AssetTypes.Person, RelatedAgentId=WebUserAgentId },
            new Domain.Entities.Asset { Id = MobileOperatorAssetId,  Latitude= 41.03111528816589, Longitude= 29.10711507182091, Altitude=0,   ThreatType=Domain.Entities.ThreatTypes.Own,       Name = "Mobile Operator", AssetType = Domain.Entities.AssetTypes.Person, RelatedAgentId=MobileOperatorAgentId }
        };

        context.Assets.AddRange(assets);
        context.SaveChanges();
    }

    public static void SeedOperation1(ApplicationDbContext context)
    {
        var operationId = Guid.Parse("a394835f-ce35-4e6b-8cd7-7e553def2e45");
        var operation = context.Operations.FirstOrDefault(o => o.Id == operationId);

        if (operation != null)
            return;

        operation = new Domain.Entities.Operation
        {
            Id = operationId,
            Name = "Hostile Aircraft Interception Operation",
            OperationType = Domain.Entities.OperationType.Intercept,
            OperationStatus = Domain.Entities.OperationStatus.InProgress,
            OperationAssets = new List<Domain.Entities.OperationAsset>
            {
                // air radar
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e44"), AssetId = AirRadarAssetId },
                // air defence gun
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e45"), AssetId = AirDefenceGunAssetId },
                // hostile aircraft
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"), AssetId = HostileAircraftAssetId },
                // mobile operator
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e50"), AssetId = MobileOperatorAssetId }
            },
            Orders = new List<Domain.Entities.Order>
            {
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("d394835f-ce35-4e6b-8cd7-7e553def2e55"),
                    Code="A1",
                    Description = "AirDefenceGun - Shut down the Hostile Aircraft",
                    OrderStatus = Domain.Entities.OrderStatus.Started,
                    OrderType = Domain.Entities.OrderTypes.Attack,
                    ResponsibleOperationAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e45"),
                    TargetOperationAssetId=Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e46"),
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:00:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetPointLatitude=0,
                    TargetPointLongitude=0,
                    TargetPointAltitude=-1,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
            }
        };

        context.Operations.AddRange(operation);
        context.SaveChanges();
    }

    public static void SeedOperation2(ApplicationDbContext context)
    {
        var operationId = Guid.Parse("37f24ca1-7ea7-4c7e-8b3d-c7e7d6282cf0");
        var operation = context.Operations.FirstOrDefault(o => o.Id == operationId);

        if (operation != null)
            return;

        operation = new Domain.Entities.Operation
        {
            Id = operationId,
            Name = "Surveillance and Destruction Operation",
            OperationType = Domain.Entities.OperationType.Intercept,
            OperationStatus = Domain.Entities.OperationStatus.InProgress,
            OperationAssets = new List<Domain.Entities.OperationAsset>
            {
                // autonomus drone
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e47"), AssetId = AutonomusDroneAssetId },
                // mobile operator
                new Domain.Entities.OperationAsset { Id = Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e51"), AssetId = MobileOperatorAssetId }
            },
            Orders = new List<Domain.Entities.Order>
            {
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("4e734f1a-4e86-471b-b55f-bf64f5ab2e7d"),
                    Code="D1",
                    Description = "Autonomous Drone - Move to Gozdagi waypoint",
                    OrderStatus = Domain.Entities.OrderStatus.Started,
                    OrderType = Domain.Entities.OrderTypes.Move,
                    ResponsibleOperationAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e47"),
                    TargetOperationAssetId=null,
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:00:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetPointLatitude=40.89063607556923,
                    TargetPointLongitude=29.253590481283204,
                    TargetPointAltitude=500,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                },
                new Domain.Entities.Order
                {
                    Id = Guid.Parse("9302c355-f545-4cef-883a-fa678ed11c6f"),
                    Code="D2",
                    Description = "Autonomous Drone - Watch over the LTFJ airport",
                    OrderStatus = Domain.Entities.OrderStatus.Started,
                    OrderType = Domain.Entities.OrderTypes.Observe,
                    ResponsibleOperationAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e47"),
                    TargetOperationAssetId=null,
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:05:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:10:00Z"),
                    TargetPointLatitude=40.89373054130338,
                    TargetPointLongitude=29.3114874611605,
                    TargetPointAltitude=1000,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                    PreviousOrderId=Guid.Parse("4e734f1a-4e86-471b-b55f-bf64f5ab2e7d")
                },
                    new Domain.Entities.Order
                {
                    Id = Guid.Parse("5a1b2c3d-4e5f-6789-abcd-ef0123456789"),
                    Code="D3",
                    Description = "Autonomous Drone - Destroy the shipyard",
                    OrderStatus = Domain.Entities.OrderStatus.Started,
                    OrderType = Domain.Entities.OrderTypes.Attack,
                    ResponsibleOperationAssetId= Guid.Parse("e394835f-ce35-4e6b-8cd7-7e553def2e47"),
                    TargetOperationAssetId=null,
                    TargetDatePeriodStart=DateTime.Parse("2025-06-01T08:15:00Z"),
                    TargetDatePeriodEnd=DateTime.Parse("2025-06-01T08:20:00Z"),
                    TargetPointLatitude=40.83936645169825,
                    TargetPointLongitude=29.286785700952468,
                    TargetPointAltitude=300,
                    TargetPointHeading=-1,
                    TargetPointSpeed=-1,
                    PreviousOrderId=Guid.Parse("9302c355-f545-4cef-883a-fa678ed11c6f")
                },
            }
        };

        context.Operations.AddRange(operation);
        context.SaveChanges();
    }


}