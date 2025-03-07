namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateEmployee
{
    public int EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }

    public string Role { get; set; } = null!;

    public string Status { get; set; } = null!;
}