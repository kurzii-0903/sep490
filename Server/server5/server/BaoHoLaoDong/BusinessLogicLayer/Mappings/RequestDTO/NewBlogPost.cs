using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewBlogPost
{
    [Required]
    public string Title { get; set; } = null!;
    [Required]
    public string Content { get; set; } = null!;
    [Required]
    public string Status { get; set; } = null!;
    [Required]
    public int Category { get; set; }
    
    [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif" })]
    [MaxFileSize(1)]
    public IFormFile? File { get; set; }
}