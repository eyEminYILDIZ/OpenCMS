namespace OpenCMS.CMS.Domain.Entities;

public class Dispatch : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DispatchCategories Category { get; set; }
    public DateTime OccuredAt { get; set; }

    public Guid RelatedEntityId { get; set; }
    public Guid? RelatedChildEntityId { get; set; }
}

public enum DispatchCategories
{
    General = 0,
    Asset = 1,
    Agent = 2,
    Operation = 3,
}
