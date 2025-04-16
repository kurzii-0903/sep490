using System.ComponentModel.DataAnnotations;

namespace BusinessLogicLayer.Mappings.RequestDTO;
public class UpdateEmployee
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [EmailAddress]
    public string Email { get; set; } = null!;
    [Phone]
    public string PhoneNumber { get; set; } = null!;
    
    public string? Address { get; set; }
    
    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }
    
    [Required]
    [RegularExpression("^(Active|InActive)$", ErrorMessage = "Status chỉ có thể là 'Active' hoặc 'Inactive'.")]
    public string Status { get; set; } = null!;
}