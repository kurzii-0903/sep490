using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }
    [HttpGet]
    public async Task<IActionResult> GetReport()
    {
        try
        {
            var report = await _reportService.GetReport();
            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}