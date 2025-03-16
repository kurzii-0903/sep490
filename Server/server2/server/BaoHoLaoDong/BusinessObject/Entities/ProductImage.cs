using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class ProductImage
{
    public int ProductImageId { get; set; }

    public int ProductId { get; set; }

    public string FileName { get; set; } = null!;

    public string? ImageUrl { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsPrimary { get; set; }

    public bool Status { get; set; }

    public virtual Product Product { get; set; } = null!;
}
