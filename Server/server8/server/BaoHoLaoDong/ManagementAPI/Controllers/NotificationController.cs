using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
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
    [HttpGet("getall-noti")]
    public async Task<IActionResult> GetAllAdminNotiAsync([FromQuery] int recipientId)
    {
        try
        {
            var notifications = await _notificationService.GetAllAdminNotiAsync(recipientId);
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
    [HttpGet("get-noti-customer")]
    public async Task<IActionResult> GetCustomerNotificationAsync(int? customerid, bool? isRead)
    {
        try
        {
            var notifications = await _notificationService.GetCustomerNotificationAsync(customerid, isRead);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}