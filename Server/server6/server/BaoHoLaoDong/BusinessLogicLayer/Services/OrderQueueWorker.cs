using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

public class OrderQueueWorker : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<OrderQueueWorker> _logger;
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly IHubContext<OrderHub> _orderHub;

    public OrderQueueWorker(IServiceScopeFactory serviceScopeFactory, ILogger<OrderQueueWorker> logger,
          IHubContext<NotificationHub> notificationHub, IHubContext<OrderHub> orderHub)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _notificationHub = notificationHub;
        _orderHub = orderHub;
        _logger = logger;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 Order Queue Worker đang chạy...");
        var delayMilliseconds = 1000; // Bắt đầu với delay nhỏ

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var orderService = services.GetRequiredService<IOrderService>();
                    var notificationService = services.GetRequiredService<INotificationService>();
                    var mailService = services.GetRequiredService<IMailService>();
                    var orderQueueService = services.GetRequiredService<IOrderQueueService>();

                    try
                    {
                        var newOrder = await orderQueueService.DequeueOrder();
                        if (newOrder != null)
                        {
                            try
                            {
                                var createdOrder = await orderService.CreateNewOrderV2Async(newOrder);
                                if (createdOrder != null)
                                {
                                    try
                                    {
                                        var notification = new NewNotification
                                        {
                                            Title = "Đơn hàng mới cần xác minh",
                                            Message = $"Đơn hàng từ khách hàng {createdOrder.Email} được tạo mới với số tiền là {createdOrder.TotalAmount}",
                                            RecipientId = 1,
                                            RecipientType = RecipientType.Employee.ToString(),
                                            Status = NotificationStatus.Active.ToString(),
                                            OrderId = createdOrder.OrderId
                                        };

                                        var notifi = await notificationService.CreateNewNotificationAsync(notification);
                                        await _notificationHub.Clients.Group(NotificationGroup.Employee.ToString())
                                            .SendAsync("ReceiveNotification", notifi);
                                        await _orderHub.Clients.All.SendAsync("NewOrderCreated", createdOrder);

                                        // Xử lý gửi email không chặn vòng lặp
                                        _ = Task.Run(() => mailService.SendOrderConfirmationEmailAsync(createdOrder), stoppingToken);

                                        _logger.LogInformation($"✅ Xử lý đơn hàng thành công của: {createdOrder.Email}");

                                        // Reset delay nếu có đơn hàng
                                        delayMilliseconds = 1000;
                                    }
                                    catch (Exception ex)
                                    {
                                        _logger.LogError($"❌ Lỗi khi gửi thông báo và email: {ex.Message}");
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError($"❌ Lỗi khi tạo đơn hàng: {ex.Message}");
                            }
                        }
                        else
                        {
                            _logger.LogInformation("⌛ Không có đơn hàng. Đang chờ...");
                            await Task.Delay(delayMilliseconds, stoppingToken);
                            delayMilliseconds = Math.Min(delayMilliseconds * 2, 10000); // Tăng delay lên nhưng không vượt quá 10 giây
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"❌ Lỗi khi xử lý hàng đợi đơn hàng: {ex.Message}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"❌ Lỗi khi lấy dịch vụ từ DI container: {ex.Message}");
                }
            }
        }
    }
}