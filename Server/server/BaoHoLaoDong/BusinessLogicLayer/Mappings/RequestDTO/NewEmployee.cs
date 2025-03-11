using System.ComponentModel.DataAnnotations;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewEmployee
{
    [Required, StringLength(50)]
    public string FullName { get; set; } = string.Empty;
    [Required,EmailAddress]
    public string Email { get; set; } = null!;
    [Required,MinLength(8),MaxLength(50)]
    public string? Password{ get; set; }
    [Required,MinLength(10),MaxLength(10)]
    public string PhoneNumber { get; set; } = null!;
    
    public string? Address { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public bool? Gender { get; set; }
    public string Role { get; set; } = "Manager";
    public string Status { get; set; } = "Active";
}