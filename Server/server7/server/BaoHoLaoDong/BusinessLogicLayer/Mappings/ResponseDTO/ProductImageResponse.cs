namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductImageResponse
{
    public int Id { get; set; }

    public string FileName { get; set; } = null!;
    public string? Image { get; set; }

    public string? Description { get; set; }
    
    public bool isPrimary { set; get; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

}