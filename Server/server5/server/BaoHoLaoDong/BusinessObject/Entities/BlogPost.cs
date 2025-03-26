using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class BlogPost
{
    public int PostId { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public int? CategoryBlogId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? FileName { get; set; }

    public string? ImageUrl { get; set; }

    public string Status { get; set; } = null!;

    public virtual BlogCategory? CategoryBlog { get; set; }
}
