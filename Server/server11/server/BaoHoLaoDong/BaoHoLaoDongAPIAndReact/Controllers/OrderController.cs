using System;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services.Interface;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using Microsoft.AspNetCore.Mvc;
using BaoHoLaoDongAPIAndReact.ModelHelper;
using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;

namespace BaoHoLaoDongAPIAndReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _notificationHub;
        private readonly INotificationService _notificationService;
        private readonly IMailService _mailService;
        private readonly IHubContext<OrderHub> _orderHub;
        private readonly ILogger<OrderController> _logger;
        private readonly IOrderQueueService _orderQueueService;
        public OrderController(IOrderService orderService, IConfiguration configuration, ILogger<OrderController> logger, IHubContext<NotificationHub> notificationHub, IHubContext<OrderHub> orderHub,
            INotificationService notificationService, IOrderQueueService orderQueueService
            , IMailService mailService)
        {
            _orderService = orderService;
            _configuration = configuration;
            _notificationHub = notificationHub;
            _orderHub = orderHub;
            _notificationService = notificationService;
            _orderQueueService = orderQueueService;
            _mailService = mailService;
            _logger = logger;
        }
        [HttpPost("create-order-v2")]
        public async Task<IActionResult> CreateOrderV2([FromBody] NewOrder newOrder)
        {
            try
            {
                var orderId = await _orderQueueService.EnqueueOrder(newOrder);
                var timeoutTask = Task.Delay(3000);
                if (_orderQueueService.TryGetPendingOrder(orderId, out var tcs))
                {
                    var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);
                    if (completedTask == tcs.Task)
                    {
                        return Ok(await tcs.Task);
                    }
                }
                return Accepted(new { Message = "Chúng tôi đã nhận đơn hàng, vui lòng đợi xác nhận." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Get all orders
        /// </summary>
        /// <returns>List OrderResponse</returns>
        [HttpGet("getall-orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns>OrderResponse</returns>
        [HttpGet("get-order/{orderId}")]
        public async Task<IActionResult> GetOrderById([FromRoute] int orderId)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return NotFound("Order not found");
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("confirm-order-by-customer")]
        public async Task<IActionResult> ConfirmOrderByCustomerAsync([FromBody] OrderConfirmModel model)
        {
            try
            {
                var orders = await _orderService.ConfirmOrderByCustomerAsync(model);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// Update order status
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="status"></param>
        /// <returns>bool</returns>
        [HttpPut("update-status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus([FromRoute] int orderId, [FromBody] string status)
        {
            try
            {
                var result = await _orderService.UpdateOrderStatusAsync(orderId, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Update order details
        /// </summary>
        /// <param name="updateOrder"></param>
        /// <returns>OrderResponse</returns>
        [HttpPut("update-order")]
        public async Task<IActionResult> UpdateOrder([FromBody] UpdateOrder updateOrder)
        {
            try
            {
                NewOrder orderRequest = new NewOrder
                {
                    //OrderId = updateOrder.OrderId,
                    // CustomerId = updateOrder.CustomerId,
                    // TotalAmount = updateOrder.TotalAmount,
                    //  Status = updateOrder.Status,
                    //  OrderDate = updateOrder.OrderDate,
                    //  UpdatedAt = updateOrder.UpdatedAt
                };

                var result = await _orderService.UpdateOrderAsync(updateOrder.OrderId, orderRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Delete order by ID
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns>bool</returns>
       
        [HttpDelete("delete-order/{orderId}")]
        public async Task<IActionResult> DeleteOrder([FromRoute] int orderId)
        {
            try
            {
                var result = await _orderService.DeleteOrderAsync(orderId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        

        /// <summary>
        /// Search orders based on criteria
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="customerName"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns>List OrderResponse</returns>
        [HttpGet("search-orders")]
        public async Task<IActionResult> SearchOrders([FromQuery] string? emailOrPhone, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string customerName, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var orders = await _orderService.SearchOrdersAsync(emailOrPhone, startDate, endDate, customerName, null, page, pageSize);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("payment")]
        public async Task<IActionResult> Payment([FromForm] PaymentInfo model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.OrderInfo))
                {
                    return BadRequest("OrderInfo is required.");
                }

                // Parse JSON từ string OrderInfo
                OrderPaymentResponse orderInfo;
                try
                {
                    orderInfo = JsonConvert.DeserializeObject<OrderPaymentResponse>(model.OrderInfo);
                }
                catch (Exception ex)
                {
                    return BadRequest("Invalid OrderInfo format: " + ex.Message);
                }
                if (orderInfo == null
                    || orderInfo.Invoice == null
                    || orderInfo.OrderDetails?.Any() != true)
                {
                    return BadRequest("Invalid data");
                }
                if (orderInfo.Invoice.PaymentMethod == "Chuyển khoản" && model.InvoiceImage != null)
                {
                    var pathFolder = _configuration["ApplicationSettings:ImageFolder"];
                    if (!Directory.Exists(pathFolder))
                    {
                        Directory.CreateDirectory(pathFolder);
                    }
                    string fileExtension = Path.GetExtension(model.InvoiceImage.FileName);
                    var fileName = orderInfo.CustomerInfo.Name.Replace(" ", "-") + DateTime.Now.ToString("yyyyMMddHHmmss") + fileExtension;
                    var filePath = Path.Combine(pathFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.InvoiceImage.CopyToAsync(stream);
                    }
                    orderInfo.Invoice.ImagePath = fileName;
                }

                var result = await _orderService.PayAsync(orderInfo);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("confirm-order")]
        public async Task<IActionResult> ConfirmOrderAsync(int orderId)
        {
            try
            {
                var result = await _orderService.ConfirmOrderAsync(orderId);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to confirm order. Order may not exist or has been processed." });
                }
                await _orderHub.Clients.All.SendAsync("OrderConfirmed", new { orderId, OrderStatus.Completed });
                //return Ok(new { message = "Order confirmed successfully", orderId });
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
        [HttpGet("get-page-orders")]
        public async Task<IActionResult> GetOrdersPageAsync([FromQuery] string? emailOrPhone,[FromQuery] int? customerId,[FromQuery] string? customerName,[FromQuery] string? startDate,[FromQuery] string? endDate,
            string? status,
            [FromQuery] int page = 1,[FromQuery] int pageSize = 20)
        {
            try
            {
                string? customerIdStr = customerId?.ToString();
                var orders = await _orderService.GetOrdersWithStringDateTimeAsync(emailOrPhone, startDate, endDate, customerName, customerIdStr, status, page, pageSize);
                if (orders == null || !orders.Items.Any())
                {
                    return NotFound(new { message = "No orders found with the given criteria." });
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to retrieve orders", error = ex.Message });
            } 
        }
        [HttpPost("calculate-order")]
        public async Task<IActionResult> CalculateOrder([FromBody] NewOrder order)
        {
            try
            {
                var orders = await _orderService.CalculateOrderAsync(order);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}