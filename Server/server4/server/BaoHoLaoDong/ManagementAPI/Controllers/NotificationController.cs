using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ManagementAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// get all admin noti
    /// </summary>
    /// <returns></returns>
    [HttpGet("getall-admin-noti")]
    public async Task<IActionResult> GetAllAdminNotiAsync()
    {
        try
        {
            var notifications = await _notificationService.GetAllAdminNotiAsync();
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("mask-as-read")]
    public async Task<IActionResult> MaskAsRead(int notificationId, bool readAll = false)
    {
        try
        {
            var result = await _notificationService.MaskAsReadAsync(notificationId, readAll);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}