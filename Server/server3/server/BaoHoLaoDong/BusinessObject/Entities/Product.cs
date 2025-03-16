using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public int? CategoryId { get; set; }

    public string? Description { get; set; }

    public string? Material { get; set; }

    public string? Origin { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public decimal? Discount { get; set; }

    public decimal? AverageRating { get; set; }

    public int? TotalSale { get; set; }

    public bool? FreeShip { get; set; }

    public int? Guarantee { get; set; }

    public string? QualityCertificate { get; set; }

    public decimal? TotalTax { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool Status { get; set; }

    public virtual ProductCategory? Category { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();

    public virtual ICollection<ProductTaxis> ProductTaxes { get; set; } = new List<ProductTaxis>();

    public virtual ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}
