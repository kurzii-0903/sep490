using DataAccessObject.Dao;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class OrderResponse
{
    public int OrderId { get; set; }
    
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; }= String.Empty;
    
    public DateTime OrderDate { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
    public int? CustomerId { get; set; }
    public string FullName { get; set; }= String.Empty;
    public string Email { get; set; }= String.Empty;
    public string PhoneNumber { get; set; } = String.Empty;
    public string Address { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }
    
    public List<OrderDetailResponse>? OrderDetails { get; set; } = new List<OrderDetailResponse>();
    
    public InvoiceResponse? Invoice { get; set; } = new InvoiceResponse();
}
