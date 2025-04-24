using BusinessLogicLayer.Validations;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateProductImage
{
    public int ProductImageId { get; set; }

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }
    [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".svg" })]
    [MaxFileSize(5)]
    public IFormFile? File { get; set; }

}