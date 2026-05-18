namespace OpenCMS.CMS.Application.Agents.Self.CheckStale;


public class Notification : INotification
{
    public Guid AgentId { get; set; }
    public DateTime PingedAt { get; set; }
}
