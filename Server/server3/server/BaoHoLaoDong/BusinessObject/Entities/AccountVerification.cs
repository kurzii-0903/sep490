using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class AccountVerification
{
    public int VerificationId { get; set; }

    public int AccountId { get; set; }

    public string AccountType { get; set; } = null!;

    public string VerificationCode { get; set; } = null!;

    public bool IsVerified { get; set; }

    public DateTime? VerificationDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Customer Account { get; set; } = null!;
}
