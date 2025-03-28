using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewBlogPost
{
    [MaxLength(255)]
    [Required]
    public string Title { get; set; } = null!;
    [Required]
    public string Content { get; set; } = null!;
    [MaxLength(500)]
    public string? Summary { get; set; }
   
    [MaxLength(255)]
    public string? Tags { get; set; }
    
    [Required]
    public string Status { get; set; } = null!;
   
    [Required]
    public int Category { get; set; }
    
    [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif" })]
    [MaxFileSize(1)]
    public IFormFile? File { get; set; }
}