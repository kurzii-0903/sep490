using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;

namespace ManagementAPI.ModelHelper
{
    public class PaymentInfo
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public string Commune { get; set; }
        public string PaymentMethod { get; set; }
        public decimal TotalAmount { get; set; }
        public int? CustomerId { get; set; }
        public string QRCode { get; set; }
        public IFormFile File { get; set; }
        public List<OrderPaymentResponseDetails> OrderDetails { get; set; }
    }
}
