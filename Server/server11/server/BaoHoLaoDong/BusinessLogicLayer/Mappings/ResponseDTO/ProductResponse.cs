
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public string? Material { get; set; }
    public string? Origin { get; set; }
    public int? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    
    // 🏷️ Giá gốc (chưa có giảm giá, chưa có thuế)
    public decimal Price { get; set; }

    // 🏷️ Giá sau khi áp dụng giảm giá (chưa có thuế)
    public decimal PriceAfterDiscount => Price - (Price * (Discount ?? 0) / 100);

    // 🏷️ Giá sau khi đã tính thuế (chưa tính giảm giá)
    public decimal PriceAfterTax => Price + (TotalTax ?? 0);

    // 🏷️ Giá đã giảm và đã tính thuế (giá cuối cùng)
    public decimal FinalPrice => PriceAfterDiscount + (TotalTax ?? 0);

    public decimal? TotalTax { get; set; } // Tổng tiền thuế
    public decimal? Discount { get; set; } // % giảm giá

    public int? TotalSale { get; set; }
    public bool? FreeShip { get; set; }
    public int? Guarantee { get; set; }
    public bool Status { get; set; }
    public int AverageRating { get; set; }
    public string? QualityCertificate { get; set; }
    
    public string Image { get; set; } = string.Empty;
    public List<ProductImageResponse> ProductImages { get; set; } = new();
    public List<ProductVariantResponse> ProductVariants { get; set; } = new();
    public List<ProductTaxResponse> Taxes { get; set; } = new();
    public List<ProductReviewResponse> Reviews { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
