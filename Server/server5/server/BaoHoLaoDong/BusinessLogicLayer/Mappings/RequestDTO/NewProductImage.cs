using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewProductImage
{
    public int ProductId { get; set; }

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }
    
    public IFormFile File { get; set; }

}