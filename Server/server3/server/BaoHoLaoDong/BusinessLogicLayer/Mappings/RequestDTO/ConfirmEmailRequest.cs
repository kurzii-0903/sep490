namespace BusinessLogicLayer.Mappings.RequestDTO;

public class ConfirmEmailRequest
{
    public string Email { get; set; } = null!;
    public string Code { get; set; } = null!;
}