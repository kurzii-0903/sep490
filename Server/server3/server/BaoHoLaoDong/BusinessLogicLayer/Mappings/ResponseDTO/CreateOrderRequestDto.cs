using DataAccessObject.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.ResponseDTO
{
    public class CreateOrderRequestDto
    {
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; }
        public InvoiceDto Invoice { get; set; }
    }
}
