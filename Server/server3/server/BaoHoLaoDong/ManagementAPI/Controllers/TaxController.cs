using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
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

   [HttpPost("create")]
   public async Task<IActionResult> Create([FromBody] NewTax tax)
   {
      try
      {
         var result = await _taxService.CreateTaxAsync(tax);
         return Ok(result);
      }
      catch (Exception ex)
      {
         return BadRequest(ex.Message);
      }
   }
   [HttpPut("update")]
   public async Task<IActionResult> Update([FromBody] UpdateTax tax)
   {
      try
      {
         var result = await _taxService.UpdateTaxAsync(tax);
         return Ok(result);
      }
      catch (Exception ex)
      {
         return BadRequest(ex.Message);
      }
   }
}