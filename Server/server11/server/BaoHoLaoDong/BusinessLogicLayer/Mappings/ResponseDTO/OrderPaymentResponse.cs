using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.ResponseDTO
{
    public class OrderPaymentResponse
    {
        public int? CustomerId { get; set; }
        public CustomerInfo CustomerInfo { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderDetailPaymentResponse> OrderDetails { get; set; }
        public InvoicePaymentResponse Invoice { get; set; }
    }
}
