using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductTaxResponse
{
    public int ProductTaxId { get; set; }

    public int? ProductId { get; set; }

    public int? TaxId { get; set; }
    
    public string TaxName { get; set; } = null!;

    public decimal TaxRate { get; set; }

    public string? Description { get; set; }

}