﻿using BusinessLogicLayer.Services.Interface;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using Microsoft.AspNetCore.Mvc;
using BusinessObject.Entities;
using ManagementAPI.ModelHelper;
using BusinessLogicLayer.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.X9;
using System.Runtime.CompilerServices;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using ManagementAPI.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace ManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IHubContext<NotificationHub> _notificationHub;
        private readonly IMailService _mailService;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public OrderController(IOrderService orderService, IConfiguration configuration,
            IMapper mapper, IHubContext<NotificationHub> notificationHub,
            IMailService mailService, INotificationService notificationService, IUserService userService)
        {
            _orderService = orderService;
            _configuration = configuration;
            _mapper = mapper;
            _notificationHub = notificationHub;
            _mailService = mailService;
            _notificationService = notificationService;
            _userService = userService;
        }

        /// <summary>
        /// Create new order
        /// </summary>
        /// <param name="newOrder"></param>
        /// <returns>OrderResponse</returns>
        /// 
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] NewOrder newOrder)
        {
            try
            {
                var result = await _orderService.CreateNewOrderAsync(newOrder);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("create-order-v2")]
        public async Task<IActionResult> CreateOrderV2([FromBody] NewOrder newOrder)
        {
            try
            {
                var result = await _orderService.CreateNewOrderV2Async(newOrder);

                if (result != null && newOrder.CustomerId != null)
                {
                    NewNotification notification = new NewNotification()
                    {
                        Title = $"Đơn hàng mới cần xác minh",
                        Message = $"Đơn hàng từ khách hàng {newOrder.CustomerName} được tạo mới với mã số tiền là {result.TotalAmount}",
                        RecipientId = 1,
                        RecipientType = RecipientType.Employee.ToString(),
                        Status = NotificationStatus.Active.ToString()

                    };
                    var notis = await _notificationService.CreateNewNotificationAsync(notification);
                    await _notificationHub.Clients.Group(NotificationGroup.Employee.ToString()).SendAsync("ReceiveNotification", notis);

                }
                if (result != null)
                {
                    var orderDetails = result.OrderDetails;
                    string htmlOrderDetails = string.Empty;
                    foreach (var item in orderDetails)
                    {
                        htmlOrderDetails = htmlOrderDetails + $"<li title=\"Sản phẩm 1\">Tên mặt hàng: {item.ProductName} - Số lượng: {item.Quantity} - Giá: {item.ProductPrice}</li>";
                    }
                    string s = $"<ul>{htmlOrderDetails}</ul>";
                    await _mailService.SendOrderConfirmationEmailAsync(newOrder.CustomerEmail, result.OrderId.ToString(), s, result.TotalAmount.ToString());
                }

                return Ok(result);
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
        /// Get orders by customer ID
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns>List OrderResponse</returns>
        [HttpGet("get-orders-by-customer/{customerId}/{page}/{pageSize}")]
        public async Task<IActionResult> GetOrders([FromQuery] int? customerId, [FromQuery] string? customerName,
            [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                string? customerIdStr = customerId?.ToString();
                var orders = await _orderService.GetOrdersAsync(startDate, endDate, customerName ?? customerIdStr, page, pageSize);
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
        public async Task<IActionResult> SearchOrders([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string customerName, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var orders = await _orderService.SearchOrdersAsync(startDate, endDate, customerName, page, pageSize);
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

        [HttpGet("img/invoice")]
        public async Task<IActionResult> GetImage(int orderId)
        {
            try
            {
                var fileName = await _orderService.GetInvoiceImageAsync(orderId);
                if (string.IsNullOrEmpty(fileName))
                {
                    return NotFound();
                }
                var pathFolder = _configuration["ApplicationSettings:ImageFolder"];
                string imagePath = Path.Combine(pathFolder, fileName);
                byte[] imageBytes = System.IO.File.ReadAllBytes(imagePath);
                string base64String = Convert.ToBase64String(imageBytes);
                return Ok(new { ImageBase64 = base64String });
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPut("confirm-order")]
        public async Task<IActionResult> ConfirmOrderAsync(int orderId)
        {
            try
            {
                var result = await _orderService.ConfirmOrderAsync(orderId);
                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("get-page-orders")]
        public async Task<IActionResult> GetOrdersPageAsync([FromQuery] int? customerId, [FromQuery] string? customerName,
            [FromQuery] string? startDate, [FromQuery] string? endDate, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                string? customerIdStr = customerId?.ToString();
                var orders = await _orderService.GetOrdersWithStringDateTimeAsync(startDate, endDate, customerName ?? customerIdStr, page, pageSize);
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

    }
}