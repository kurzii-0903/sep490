namespace BusinessLogicLayer.Mappings.RequestDTO;

public class UpdateCustomer
{
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public DateOnly Birthday { get; set; }
    public bool Gender { get; set; }
}