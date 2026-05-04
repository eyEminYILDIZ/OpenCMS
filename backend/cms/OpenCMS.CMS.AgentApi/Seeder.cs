using OpenCMS.CMS.Infrastructure;

namespace OpenCMS.CMS.AgentApi;

public class Seeder
{
    public static void SeedAgents(ApplicationDbContext context)
    {
        var agents = new[]
        {
            new Domain.Entities.Agent { Name = "Agent A" },
            new Domain.Entities.Agent { Name = "Agent B" },
            new Domain.Entities.Agent { Name = "Agent C" }
        };

        context.Agents.AddRange(agents);
        context.SaveChanges();
    }
}