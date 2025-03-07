using DataAccessObject.Dao;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class OrderResponse
{
    public int OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int CustomerId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public bool IsEmailVerified { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string DateOfBirth { get; set; }
    public bool Gender { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ImageUrl { get; set; }
    public DateTime UpdateAt { get; set; }
    public List<OrderDetailResponse> OrderDetails { get; set; }
    public List<InvoiceResponse> Receipts { get; set; }
}
