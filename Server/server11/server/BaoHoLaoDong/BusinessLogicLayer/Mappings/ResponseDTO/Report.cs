using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class Report
{
    public int TotalCustomer  { get; set; }
    public int TotalOrder { get; set; }
    public int TotalProductSale  { get; set; }
    public int TotalProductStopSale { get; set; }
    public List<Revenue>? Revenues { get; set; } = new List<Revenue>();
    public List<ProductSaleResponse>? TopSaleproduct { get; set; } = new List<ProductSaleResponse>();
    public List<OrderResponse> Orders { get; set; } = new List<OrderResponse>();

}
public class ProductSaleResponse
{
    public ProductResponse Product { get; set; }
    public int Quantity { get; set; }
}