namespace OpenCMS.CMS.Domain.Entities;

public class BaseEntity : CoreEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}