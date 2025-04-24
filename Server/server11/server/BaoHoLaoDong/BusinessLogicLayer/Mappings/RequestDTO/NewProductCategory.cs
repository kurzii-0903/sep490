namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewProductCategory
{
    public string CategoryName { get; set; } = null!;

    public string Description { get; set; } = null!;
    
    public int? GroupId { get; set; }
}