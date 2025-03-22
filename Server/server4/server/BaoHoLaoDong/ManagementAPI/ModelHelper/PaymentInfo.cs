using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;

namespace ManagementAPI.ModelHelper
{
    public class PaymentInfo
    {
        public string OrderInfo { get; set; }
        public IFormFile? InvoiceImage { get; set; }
    }
}
