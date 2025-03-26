using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    public class UpdateOrder
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}