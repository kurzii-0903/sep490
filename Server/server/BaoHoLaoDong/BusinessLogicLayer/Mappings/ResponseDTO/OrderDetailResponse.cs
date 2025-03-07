namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class OrderDetailResponse
{
    public int OrderDetailId { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal ProductPrice { get; set; }

    public decimal? ProductDiscount { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }
}