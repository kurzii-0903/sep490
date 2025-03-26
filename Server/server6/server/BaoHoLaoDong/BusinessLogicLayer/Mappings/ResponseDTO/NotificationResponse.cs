namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class NotificationResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public int RecipientId { get; set; }

    public string RecipientType { get; set; } = null!;

    public bool IsRead { get; set; }
    
    public int OrderId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string Status { get; set; } = null!;
}