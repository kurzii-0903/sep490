using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace BaoHoLaoDongAPIAndReact.Controllers;
[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class ConfigsController : ControllerBase
{
    private readonly string _clientId;
    private readonly string _bankCode;
    private readonly string _bankName;

    public ConfigsController(IConfiguration config)
    {
        _clientId = config["GoogleAuth:ClientId"];
        _bankCode = config["AccountBank:BankCode"];
        _bankName = config["AccountBank:AccountNumber"];
    }

    [HttpGet]
    public IActionResult GetClientId()
    {
        return Ok(new { clientId = _clientId,bankCode = _bankCode,bankName = _bankName });
    }
}