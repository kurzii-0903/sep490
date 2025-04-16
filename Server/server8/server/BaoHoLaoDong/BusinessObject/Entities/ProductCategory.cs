using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class ProductCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public int? GroupId { get; set; }

    public string? Description { get; set; }

    public virtual ProductCategoryGroup? Group { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
