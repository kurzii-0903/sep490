using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    class CustomerPaymentInfo
    {
        public string Email { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Province { get; set; }   
        public string District { get; set; }   
        public string Commune { get; set; }   
    }
}
