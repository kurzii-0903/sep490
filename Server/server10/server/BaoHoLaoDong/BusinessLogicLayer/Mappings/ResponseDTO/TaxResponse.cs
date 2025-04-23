using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class TaxResponse
{
    public int TaxId { get; set; }

    public string TaxName { get; set; } = null!;

    public decimal TaxRate { get; set; }

    public string? Description { get; set; }
}