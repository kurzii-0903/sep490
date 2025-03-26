using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductCategoryGroupResponse
{
    public int GroupId { get; set; }

    public string GroupName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<CategoryResponse> Categories { get; set; } = new List<CategoryResponse>();
}