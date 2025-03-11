using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class OrderDetail
{
    public int OrderDetailId { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal ProductPrice { get; set; }

    public decimal? ProductDiscount { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
