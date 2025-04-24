using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public bool? Gender { get; set; }

    public int RoleId { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<BlogPost> BlogPostCreateByNavigations { get; set; } = new List<BlogPost>();

    public virtual ICollection<BlogPost> BlogPostUpdateByNavigations { get; set; } = new List<BlogPost>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Role Role { get; set; } = null!;
}
