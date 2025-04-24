using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    public class NewOrderDetail
    {
        
        public int ProductId { get; set; }

        public int ?VariantId { get; set; } = null;
        public int Quantity { get; set; }
    }
}