using BusinessLogicLayer.Validations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewProductImage
{
    public int ProductId { get; set; }

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }
    [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif" })]
    [MaxFileSize(5)]
    public IFormFile File { get; set; }

}