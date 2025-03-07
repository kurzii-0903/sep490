
using System.ComponentModel.DataAnnotations;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateProductVariant
{
    [Required]
    public int VariantId { get; set; }
    [Required]
    public int ProductId { get; set; }
    
    public string? Size { get; set; }

    public string? Color { get; set; }

    public int Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? Discount { get; set; }

    public bool Status { get; set; }
}