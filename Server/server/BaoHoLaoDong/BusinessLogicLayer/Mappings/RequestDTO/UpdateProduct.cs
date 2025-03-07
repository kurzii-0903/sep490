using System.ComponentModel.DataAnnotations;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateProduct
{
    [Required]
    public int Id { get; set; }
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; } = null!;
    [Required]
    public int? CategoryId { get; set; }

    public string? Description { get; set; }
    public string? Material { get; set; }

    public string? Origin { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative.")]
    public int Quantity { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative.")]
    public decimal Price { get; set; }

    [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100.")]
    public decimal? Discount { get; set; }
    public string? QualityCertificate { get; set; }

    public bool Status { get; set; }
}