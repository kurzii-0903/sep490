namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class OrderDetailResponse
{
    public int OrderDetailId { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;
    
    public string ProductImage { get; set; } = string.Empty;

    public decimal ProductPrice { get; set; }

    public decimal? ProductDiscount { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

}