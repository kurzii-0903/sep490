using System;
using System.Collections.Generic;

namespace BusinessObject.Entities;

public partial class Notification
{
    public int NotificationId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public int? RecipientId { get; set; }

    public string RecipientType { get; set; } = null!;

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? OrderId { get; set; }

    public string Status { get; set; } = null!;

    public virtual Employee? Recipient { get; set; }
}
