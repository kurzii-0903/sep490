using System.ComponentModel.DataAnnotations;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class ResetPassword
{
    public string Token { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}