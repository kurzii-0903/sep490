
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }
    
    public string? Material { get; set; }

    public string? Origin { get; set; }
    
    public int? CategoryId { get; set; }
    public string CategoryName { get; set; } =string.Empty;
    
    public int Quantity { get; set; }

    public decimal Price { get; set; }
    
    public decimal PriceDiscount { get; set; }
    
    public int? TotalSale { get; set; }

    public bool? FreeShip { get; set; }

    public int? Guarantee { get; set; }
    public decimal? Discount { get; set; }

    public bool Status { get; set; }
    
    public int AverageRating { get; set; }
    
    public string? QualityCertificate { get; set; }
    
    public decimal? TotalTax { get; set; }
    
    public string Image { get; set; } = string.Empty;
    
    public List<ProductImageResponse> ProductImages { get; set; } = new List<ProductImageResponse>();
    
    public List<ProductVariantResponse> ProductVariants { get; set; } = new List<ProductVariantResponse>();
    
    public List<ProductTaxResponse> Taxes { get; set; } = new List<ProductTaxResponse>();
    
    public List<ProductReviewResponse> Reviews { get; set; } = new List<ProductReviewResponse>();
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}