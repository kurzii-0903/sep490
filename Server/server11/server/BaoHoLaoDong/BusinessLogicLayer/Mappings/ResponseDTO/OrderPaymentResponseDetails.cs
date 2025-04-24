using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.ResponseDTO
{
    public class OrderPaymentResponseDetails
    {
        public int ProductId { get; set; }
        public int ProductVariantId { get; set; }
        public string ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
