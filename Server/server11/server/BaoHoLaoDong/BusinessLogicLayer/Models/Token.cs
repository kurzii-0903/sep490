namespace BusinessLogicLayer.Models;

public class Token
{
    public virtual string key { get; set; }
    public virtual string issuer { get; set; }
    public virtual string audience { get; set; }
    public virtual int expriryInDay { get; set; }
}
