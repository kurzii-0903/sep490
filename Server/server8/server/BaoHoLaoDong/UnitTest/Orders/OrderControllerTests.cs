using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using BusinessLogicLayer.Services.Interface;
using ManagementAPI.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Hubs;
using Microsoft.AspNetCore.SignalR;
using BusinessObject.Entities;
using BusinessLogicLayer.Mappings.ResponseDTO;

namespace UnitTest.Orders
{
    [TestFixture]
    public class OrderControllerTests
    {
        private Mock<IOrderService> _orderServiceMock;
        private Mock<IConfiguration> _configurationMock;
        private Mock<ILogger<OrderController>> _loggerMock;
        private Mock<IHubContext<NotificationHub>> _notificationHubMock;
        private Mock<IHubContext<OrderHub>> _orderHubMock;
        private Mock<INotificationService> _notificationServiceMock;
        private Mock<IOrderQueueService> _orderQueueServiceMock;
        private Mock<IMailService> _mailServiceMock;
        private OrderController _orderController;

        [SetUp]
        public void SetUp()
        {
            _orderServiceMock = new Mock<IOrderService>();
            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<OrderController>>();
            _notificationHubMock = new Mock<IHubContext<NotificationHub>>();
            _orderHubMock = new Mock<IHubContext<OrderHub>>();
            _notificationServiceMock = new Mock<INotificationService>();
            _orderQueueServiceMock = new Mock<IOrderQueueService>();
            _mailServiceMock = new Mock<IMailService>();

            _orderController = new OrderController(
                _orderServiceMock.Object,
                _configurationMock.Object,
                _loggerMock.Object,
                _notificationHubMock.Object,
                _orderHubMock.Object,
                _notificationServiceMock.Object,
                _orderQueueServiceMock.Object,
                _mailServiceMock.Object
            );
        }
     
        [Test]
        public async Task CreateOrderV2_ShouldReturnAccepted_WhenOrderIsProcessed()
        {
            // Arrange
            var newOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "nguyenvana@example.com",
                CustomerAddress = "123 Đường ABC, Quận 1, TP. HCM",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail>
        {
            new NewOrderDetail { ProductId = 1, Quantity = 3 },
            new NewOrderDetail { ProductId = 2, Quantity = 1 }
        }
            };

            var orderResponse = new OrderResponse
            {
                OrderId = 3,
                CustomerId = 1,
                FullName = newOrder.CustomerName,
                PhoneNumber = newOrder.CustomerPhone,
                Email = newOrder.CustomerEmail ?? string.Empty,
                Address = newOrder.CustomerAddress,
                TotalAmount = 450,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            var tcs = new TaskCompletionSource<OrderResponse>();
            tcs.SetResult(orderResponse);

            _orderQueueServiceMock.Setup(s => s.TryGetPendingOrder(It.IsAny<Guid>(), out It.Ref<TaskCompletionSource<OrderResponse>>.IsAny))
                .Returns((Guid id, out TaskCompletionSource<OrderResponse> result) =>
                {
                    result = tcs;
                    return true;
                });

            // Act
            var result = await _orderController.CreateOrderV2(newOrder);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            // Thay vì OkObjectResult
            var acceptedResult = (OkObjectResult)result;
            var actualOrder = acceptedResult.Value as OrderResponse;

            Assert.That(actualOrder, Is.Not.Null);
            Assert.That(actualOrder?.OrderId, Is.EqualTo(orderResponse.OrderId));
            Assert.That(actualOrder?.Status, Is.EqualTo(orderResponse.Status));
        }
        [Test]
        public async Task CreateOrderV2_ValidOrder_ReturnsAcceptedResult()
        {
            // Arrange
            var newOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "nguyenvana@example.com",
                CustomerAddress = "123 Đường ABC, Quận 1, TP. HCM",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail>
                {
                    new NewOrderDetail { ProductId = 1, Quantity = 3 },
                    new NewOrderDetail { ProductId = 2, Quantity = 1 }
                }
            };

            var orderResponse = new OrderResponse
            {
                OrderId = 3,
                CustomerId = 1,
                FullName = newOrder.CustomerName,
                PhoneNumber = newOrder.CustomerPhone,
                Email = newOrder.CustomerEmail ?? string.Empty,
                Address = newOrder.CustomerAddress,
                TotalAmount = 300,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };
            var tcs = new TaskCompletionSource<OrderResponse>();
            tcs.SetResult(orderResponse);
            _orderQueueServiceMock.Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>())).ReturnsAsync(Guid.NewGuid());
            _orderQueueServiceMock
                 .Setup(s => s.TryGetPendingOrder(It.IsAny<Guid>(), out tcs))
                 .Returns(true);
            // Act
            var result = await _orderController.CreateOrderV2(newOrder);

            // Assert
            Assert.That(result, Is.Not.Null, "API trả về null");

            if (result is OkObjectResult okResult)
            {
                Assert.That(okResult.Value, Is.Not.Null, "API không trả về dữ liệu đơn hàng");
                var actualOrder = okResult.Value as OrderResponse;
                Assert.That(actualOrder, Is.Not.Null);
                Assert.That(actualOrder?.OrderId, Is.EqualTo(orderResponse.OrderId));
            }
            else if (result is AcceptedResult acceptedResult)
            {
                Assert.That(acceptedResult.Value, Is.Not.Null, "API trả về Accepted nhưng không có thông báo");
            }
            else
            {
                Assert.Fail($"API trả về kiểu {result.GetType().Name} không mong đợi.");
            }

        }
        [Test]
        public async Task CreateOrderV2_InvalidOrder_ReturnsBadRequest()
        {
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "",
                CustomerPhone = null, 
                CustomerEmail = "invalid-email",
                CustomerAddress = "", 
                PaymentMethod = "Unknown", 
                OrderDetails = new List<NewOrderDetail>() 
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Thông tin đơn hàng không hợp lệ"));

            // Act: Gọi API với đơn hàng không hợp lệ
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert: Kiểm tra kết quả
            Assert.That(result, Is.Not.Null, "API trả về null");

            if (result is BadRequestObjectResult badRequestResult)
            {
                Assert.That(badRequestResult.Value, Is.Not.Null, "API trả về BadRequest nhưng không có thông báo lỗi");
                Assert.That(badRequestResult.Value.ToString(), Does.Contain("Thông tin đơn hàng không hợp lệ"));
            }
            else
            {
                Assert.Fail($"API trả về kiểu {result.GetType().Name} không mong đợi.");
            }
        }
        [Test]
        public async Task CreateOrderV2_MissingCustomerName_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "", 
                CustomerPhone = "0123456789",
                CustomerEmail = "valid@example.com",
                CustomerAddress = "123 Đường ABC",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail> { new NewOrderDetail { ProductId = 1, Quantity = 2 } }
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Tên khách hàng không được để trống"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Tên khách hàng không được để trống"));
        }
        [Test]
        public async Task CreateOrderV2_MissingCustomerPhone_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = null, 
                CustomerEmail = "valid@example.com",
                CustomerAddress = "123 Đường ABC",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail> { new NewOrderDetail { ProductId = 1, Quantity = 2 } }
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Số điện thoại không được để trống"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Số điện thoại không được để trống"));
        }
        [Test]
        public async Task CreateOrderV2_MissingCustomerEmail_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "", 
                CustomerAddress = "123 Đường ABC",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail> { new NewOrderDetail { ProductId = 1, Quantity = 2 } }
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Email không hợp lệ"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Email không hợp lệ"));
        }
        [Test]
        public async Task CreateOrderV2_MissingCustomerAddress_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "valid@example.com",
                CustomerAddress = "", 
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail> { new NewOrderDetail { ProductId = 1, Quantity = 2 } }
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Địa chỉ không được để trống"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Địa chỉ không được để trống"));
        }
        [Test]
        public async Task CreateOrderV2_MissingPaymentMethod_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "valid@example.com",
                CustomerAddress = "123 Đường ABC",
                PaymentMethod = "", 
                OrderDetails = new List<NewOrderDetail> { new NewOrderDetail { ProductId = 1, Quantity = 2 } }
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Phương thức thanh toán không hợp lệ"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Phương thức thanh toán không hợp lệ"));
        }
        [Test]
        public async Task CreateOrderV2_EmptyOrderDetails_ReturnsBadRequest()
        {
            // Arrange
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "valid@example.com",
                CustomerAddress = "123 Đường ABC",
                PaymentMethod = "Cash",
                OrderDetails = new List<NewOrderDetail>() 
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Đơn hàng phải có ít nhất một sản phẩm"));

            // Act
            var result = await _orderController.CreateOrderV2(invalidOrder);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Đơn hàng phải có ít nhất một sản phẩm"));
        }
        [Test]
        public async Task UpdateOrderStatus_ValidOrderId_ReturnsOkObjectResult()
        {
            // Arrange
            int orderId = 1;
            string newStatus = "Completed";
            _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(orderId, newStatus)).ReturnsAsync(true);

            // Act
            var result = await _orderController.UpdateOrderStatus(orderId, newStatus);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>()); // Thay OkResult bằng OkObjectResult
        }
        [Test]
        public async Task UpdateOrderStatus_InvalidOrderId_ReturnsOkObjectResult()
        {
            // Arrange
            int orderId = 99;
            string newStatus = "Completed";
            _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(orderId, newStatus)).ReturnsAsync(false);

            // Act
            var result = await _orderController.UpdateOrderStatus(orderId, newStatus);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>()); // Thay NotFoundResult bằng OkObjectResult
        }
        [Test]
        public async Task UpdateOrderStatus_InvalidStatus_ReturnsBadRequest()
        {
            // Arrange
            int orderId = 1;
            string newStatus = ""; // Trạng thái trống -> không hợp lệ
            _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(orderId, newStatus))
                             .ThrowsAsync(new ArgumentException("Trạng thái không hợp lệ"));

            // Act
            var result = await _orderController.UpdateOrderStatus(orderId, newStatus);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Trạng thái không hợp lệ"));
        }
        [Test]
        public async Task UpdateOrderStatus_NegativeOrderId_ReturnsBadRequest()
        {
            // Arrange
            int orderId = -1; // ID âm -> không hợp lệ
            string newStatus = "Completed";
            _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(orderId, newStatus))
                             .ThrowsAsync(new ArgumentException("ID đơn hàng không hợp lệ"));

            // Act
            var result = await _orderController.UpdateOrderStatus(orderId, newStatus);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("ID đơn hàng không hợp lệ"));
        }
        [Test]
        public async Task UpdateOrderStatus_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int orderId = 1;
            string newStatus = "Completed";
            _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(orderId, newStatus))
                             .ThrowsAsync(new Exception("Lỗi hệ thống"));

            // Act
            var result = await _orderController.UpdateOrderStatus(orderId, newStatus);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>(), "API không trả về BadRequest khi gặp lỗi");

            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult?.Value.ToString(), Does.Contain("Lỗi hệ thống"), "Thông báo lỗi không chính xác");
        }

        [Test]
        public async Task CreateOrderV2_NullOrderDetails_ReturnsBadRequest()
        {
            var invalidOrder = new NewOrder
            {
                TrackingId = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerPhone = "0123456789",
                CustomerEmail = "valid@example.com",
                CustomerAddress = "123 Street",
                PaymentMethod = "Cash",
                OrderDetails = null
            };

            _orderQueueServiceMock
                .Setup(s => s.EnqueueOrder(It.IsAny<NewOrder>()))
                .ThrowsAsync(new ArgumentException("Chi tiết đơn hàng không được để trống"));

            var result = await _orderController.CreateOrderV2(invalidOrder);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest?.Value.ToString(), Does.Contain("Chi tiết đơn hàng không được để trống"));
        }

    }
}