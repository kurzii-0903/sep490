using System.ComponentModel.DataAnnotations;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewCustomer
{
    [Required,MaxLength(100)]
    public string FullName { get; set; } = null!;
    [Required,EmailAddress]
    public string Email { get; set; } = null!;
    [Required,MinLength(8),MaxLength(50)]
    public string? Password { get; set; }
    [Phone]
    public string PhoneNumber { get; set; } = null!;
    
    public string ImageUrl { get; set; }
    
    public bool IsEmailVerified { get; set; }
    
    public string? Address { get; set; }
    
    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }

}