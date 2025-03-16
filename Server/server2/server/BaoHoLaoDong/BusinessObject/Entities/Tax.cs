using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Tax
{
    public int TaxId { get; set; }

    public string TaxName { get; set; } = null!;

    public decimal TaxRate { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<ProductTaxis> ProductTaxes { get; set; } = new List<ProductTaxis>();
}
