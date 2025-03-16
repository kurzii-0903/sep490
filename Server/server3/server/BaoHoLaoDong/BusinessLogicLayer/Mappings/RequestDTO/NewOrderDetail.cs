using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    public class NewOrderDetail
    {
        
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public string? Size { get; set; }

        public string? Color { get; set; }
    }
}