using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.ResponseDTO
{
    public class InvoiceDto
    {
        public int InvoiceNumber { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string QRCodeData { get; set; }
        public string PaymentStatus { get; set; }
        public string Status { get; set; }
    }
}
