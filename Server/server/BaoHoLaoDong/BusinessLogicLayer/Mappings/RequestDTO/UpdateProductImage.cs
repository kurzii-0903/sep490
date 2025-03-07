using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateProductImage
{
    public int ProductImageId { get; set; }

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }
    
    public IFormFile? File { get; set; }

}