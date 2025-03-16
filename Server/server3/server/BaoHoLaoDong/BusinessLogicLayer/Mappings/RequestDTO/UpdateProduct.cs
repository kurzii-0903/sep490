using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateProduct
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public int? CategoryId { get; set; }

    public string? Description { get; set; }
    [NoSpecialCharacters]
    public string? Material { get; set; }
    [NoSpecialCharacters]
    public string? Origin { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative.")]
    public int Quantity { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative.")]
    public decimal Price { get; set; }

    public bool FreeShip { get; set; }
    [Range(0,int.MaxValue, ErrorMessage = "Guarantee must >= 0")]
    public int Guarantee { get; set; }
    
    [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100.")]
    public decimal? Discount { get; set; }
    public string? QualityCertificate { get; set; }

    public bool Status { get; set; }
}