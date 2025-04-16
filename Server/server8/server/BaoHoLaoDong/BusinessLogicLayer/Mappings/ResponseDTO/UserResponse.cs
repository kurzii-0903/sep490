namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class UserResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool IsEmailVerified { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? UpdateAt { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    
    public string Status { get; set; } = null!;

}