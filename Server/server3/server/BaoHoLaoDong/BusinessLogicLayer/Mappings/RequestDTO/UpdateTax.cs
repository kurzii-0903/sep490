using System.ComponentModel.DataAnnotations;
namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateTax
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public decimal Rate { get; set; }

    public string? Description { get; set; }
}