namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class BlogPostResponse
{
    public int PostId { get; set; }

    public string Title { get; set; } = null!;
    
    public string Summary { get; set; } = null!;
    
    public string Tags { get; set; } = null!;
    
    public string? PostUrl { get; set; }
    public string Content { get; set; } = null!;
    
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? ImageUrl { get; set; }

    public string Status { get; set; } = null!;
}