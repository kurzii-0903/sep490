using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace BaoHoLaoDongAPIAndReact.Controllers;
[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class ConfigsController : ControllerBase
{
    private readonly string _clientId;

    public ConfigsController(IConfiguration config)
    {
        _clientId = config["GoogleAuth:ClientId"];
    }

    [HttpGet("google-client")]
    public IActionResult GetClientId()
    {
        return Ok(new { clientId = _clientId });
    }
}