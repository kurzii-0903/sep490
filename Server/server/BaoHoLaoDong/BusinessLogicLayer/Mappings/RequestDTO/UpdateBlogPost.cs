using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateBlogPost
{
    public int PostId { get; set; }
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string Status { get; set; } = null!;

    public IFormFile? File { get; set; } = null!;
}