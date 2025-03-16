using System;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class EmployeeResponse
{
    public int EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? Address { get; set; }

    public string? DateOfBirth { get; set; }

    public string Gender { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string Status { get; set; } = null!;
}