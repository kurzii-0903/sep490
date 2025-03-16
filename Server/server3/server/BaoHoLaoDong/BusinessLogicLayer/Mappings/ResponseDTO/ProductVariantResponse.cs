namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductVariantResponse
{
    public int VariantId { get; set; }

    public int ProductId { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    public int Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? Discount { get; set; }

    public bool Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

}