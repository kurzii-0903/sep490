using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewGroupCategory
{
    [Required]
    [NoSpecialCharacters]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }
}