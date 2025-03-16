using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Invoice
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

    public string? ImagePath { get; set; }

    public string? FileName { get; set; }

    public virtual Order Order { get; set; } = null!;
}
