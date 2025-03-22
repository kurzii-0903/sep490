using System.ComponentModel.DataAnnotations;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewTax
{
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public decimal Rate { get; set; }

    public string? Description { get; set; }
}