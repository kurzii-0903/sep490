using BusinessLogicLayer.Validations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateBlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Status { get; set; } = null!;
    
    public int Category { get; set; }

    [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif" })]
    [MaxFileSize(1)]
    public IFormFile? File { get; set; } = null!;
}