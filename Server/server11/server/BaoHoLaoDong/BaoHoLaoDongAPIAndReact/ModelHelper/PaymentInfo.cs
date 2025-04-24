using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BaoHoLaoDongAPIAndReact.ModelHelper
{
    public class PaymentInfo
    {
        public string OrderInfo { get; set; }
        public IFormFile? InvoiceImage { get; set; }
    }
}
