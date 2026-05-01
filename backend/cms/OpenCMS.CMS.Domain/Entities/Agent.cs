namespace OpenCMS.CMS.Domain.Entities;

public class Agent : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public AgentTypes AgentType { get; set; }
    public DateTime LastSeen { get; set; }
    public bool IsActive { get; set; }
}

public enum AgentTypes
{
    ComputerProgram = 0,
    Person = 1,
    InputOutput = 2,
    InputOnly = 3,
    OutputOnly = 4,
}