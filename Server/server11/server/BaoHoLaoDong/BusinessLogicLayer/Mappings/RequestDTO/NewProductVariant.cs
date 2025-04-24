using System.ComponentModel.DataAnnotations;
namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewProductVariant
{
    public int ProductId { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
    [Range(0, double.MaxValue)]
    public decimal? Price { get; set; }
    [Range(0, int.MaxValue)]
    public decimal? Discount { get; set; }
    
    public bool Status { get; set; }
}