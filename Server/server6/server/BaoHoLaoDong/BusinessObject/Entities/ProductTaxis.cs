using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class ProductTaxis
{
    public int ProductTaxId { get; set; }

    public int? ProductId { get; set; }

    public int? TaxId { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Tax? Tax { get; set; }
}
