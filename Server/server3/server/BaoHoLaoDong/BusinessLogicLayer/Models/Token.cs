namespace BusinessLogicLayer.Models;

public class Token
{
    public string key { get; set; }
    public string issuer { get; set; }
    public string audience { get; set; }
    public int  expriryInDay { get; set; }
}