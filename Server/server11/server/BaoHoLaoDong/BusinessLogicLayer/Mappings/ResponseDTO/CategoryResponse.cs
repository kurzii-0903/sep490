namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class CategoryResponse
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string Description { get; set; } = null!;
    
    public int GroupId { get; set; }
}