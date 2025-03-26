using System;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class CustomerResponse
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool IsEmailVerified { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? UpdateAt { get; set; }

}