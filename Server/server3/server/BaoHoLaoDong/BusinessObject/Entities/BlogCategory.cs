using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class BlogCategory
{
    public int CategoryBlogId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
}
