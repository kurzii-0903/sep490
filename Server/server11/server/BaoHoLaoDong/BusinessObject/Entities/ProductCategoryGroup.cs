using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class ProductCategoryGroup
{
    public int GroupId { get; set; }

    public string GroupName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
}
