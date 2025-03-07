using BusinessLogicLayer.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ManagementAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class TaxController : ControllerBase
{
   private readonly ITaxService _taxService;
   public TaxController(ITaxService taxService)
   {
      _taxService = taxService;
   }
   
   /// <summary>
   /// get all taxes
   /// </summary>
   /// <returns></returns>
   [HttpGet("getall")]
   public async Task<IActionResult> GetAll()
   {
      try
      {
         var taxes = await _taxService.GetAllTaxAsync();
         return Ok(taxes);
      }
      catch (Exception ex)
      {
         return BadRequest(ex.Message);
      }
   }
}