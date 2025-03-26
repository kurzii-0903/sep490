using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Mappings.ResponseDTO;
using System.Text.Json.Serialization;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewOrder
{
    
    [Required]
    public string CustomerName { get; set; } = null!;
    [Required]
    [Phone]
    public string CustomerPhone { get; set; } = null!;
    [EmailAddress]
    public string? CustomerEmail { get; set; }
    [Required]
    public string CustomerAddress { get; set; } = null!;

    private string _paymentMethod = "Cash"; // Giá trị mặc định

    public string PaymentMethod
    {
        get => string.IsNullOrWhiteSpace(_paymentMethod) ? "Cash" : _paymentMethod;
        set => _paymentMethod = string.IsNullOrWhiteSpace(value) ? "Cash" : value;
    }
    public virtual ICollection<NewOrderDetail> OrderDetails { get; set; } = new List<NewOrderDetail>();
}