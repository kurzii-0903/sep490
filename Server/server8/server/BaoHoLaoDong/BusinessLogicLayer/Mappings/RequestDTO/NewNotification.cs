namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewNotification
{
    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;
    public int RecipientId { get; set; }
    public string RecipientType { get; set; } = null!;
    public int OrderId { get; set; }
    public string Status { get; set; } = null!;
}