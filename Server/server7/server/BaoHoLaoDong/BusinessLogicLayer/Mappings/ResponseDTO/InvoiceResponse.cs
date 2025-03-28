using System;

namespace BusinessLogicLayer.Mappings.ResponseDTO
{
    public class InvoiceResponse
    {
        public int InvoiceId { get; set; }
        public int OrderId { get; set; }

        public string InvoiceNumber { get; set; } = null!;

        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string? QrcodeData { get; set; }

        public string PaymentStatus { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime? PaymentDate { get; set; }

        public bool? PaymentConfirmOfCustomer { get; set; }

        public virtual OrderResponse Order { get; set; } = null!;
    }
}
