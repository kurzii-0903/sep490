using BusinessLogicLayer.Services.Interface;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using Microsoft.AspNetCore.Mvc;
using BusinessObject.Entities;
using ManagementAPI.ModelHelper;
using BusinessLogicLayer.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace ManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IConfiguration _configuration;

        public OrderController(IOrderService orderService, IConfiguration configuration)
        {
            _orderService = orderService;
            _configuration = configuration;
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
                    OrderId = updateOrder.OrderId,
                    CustomerId = updateOrder.CustomerId,
                    TotalAmount = updateOrder.TotalAmount,
                    Status = updateOrder.Status,
                    OrderDate = updateOrder.OrderDate,
                    UpdatedAt = updateOrder.UpdatedAt
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
        public async Task<IActionResult> GetOrdersByCustomerId([FromRoute] int customerId, [FromRoute] int page = 1, [FromRoute] int pageSize = 20)
        {
            try
            {
                var orders = await _orderService.GetOrdersByCustomerIdAsync(customerId, page, pageSize);
                return Ok(orders);
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

        [AllowAnonymous]
        [HttpPost("payment")]
        public async Task<IActionResult> Payment([FromBody] PaymentInfo paymentInfo)
        {
            try
            {
                OrderResponse order = new OrderResponse
                {
                    CustomerId = paymentInfo.CustomerId,
                    TotalAmount = paymentInfo.TotalAmount,
                    Status = OrderStatus.Pending.ToString(),
                    OrderDate = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    OrderDetails = paymentInfo.OrderDetails
                    .Select(x => new OrderDetailResponse
                    {
                        ProductId = x.ProductId,
                        ProductVariantId = x.ProductVariantId,
                        ProductName = x.ProductName,
                        ProductPrice = x.ProductPrice,
                        Quantity = x.Quantity,
                        TotalPrice = x.TotalPrice,
                        Size = x.Size,
                        Color = x.Color,
                        CreatedAt = x.CreatedAt
                    }).ToList(),
                    CustomerInfo = JsonSerializer.Serialize(new CustomerInfo
                    {
                        Name = paymentInfo.Name,
                        Email = paymentInfo.Email,
                        PhoneNumber = paymentInfo.PhoneNumber,
                        Address = paymentInfo.Address,
                        Province = paymentInfo.Province,
                        District = paymentInfo.District,
                        Commune = paymentInfo.Commune
                    })
                };
                if (paymentInfo.PaymentMethod == "Chuyển khoản" && paymentInfo.File != null)
                {
                    var pathFolder = _configuration["ApplicationSettings:ImageFolder"];
                    if (!Directory.Exists(pathFolder))
                    {
                        Directory.CreateDirectory(pathFolder);
                    }
                    var fileName = Guid.NewGuid().ToString();
                    var filePath = Path.Combine(pathFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await paymentInfo.File.CopyToAsync(stream);
                    }
                    InvoiceResponse invoice = new InvoiceResponse
                    {
                        PaymentMethod = paymentInfo.PaymentMethod,
                        QrcodeData = paymentInfo.QRCode,
                        Status = InvoiceStatus.Pending.ToString(),
                        InvoiceNumber = Guid.NewGuid().ToString(),
                        Amount = paymentInfo.TotalAmount,
                        ImagePath = filePath
                    };
                    order.Receipts = new List<InvoiceResponse> { invoice };
                }

                var result = await _orderService.PayAsync(order);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}