using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Order
{
    public int OrderId { get; set; }

    public int? CustomerId { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = null!;

    public DateTime OrderDate { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? CustomerInfo { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
