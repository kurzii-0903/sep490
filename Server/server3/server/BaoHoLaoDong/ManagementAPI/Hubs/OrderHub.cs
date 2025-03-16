using Microsoft.AspNetCore.SignalR;

namespace ManagementAPI.Hubs
{
    public class OrderHub : Hub
    {
        public async Task NotifyOrderStatusChange(int orderId, string status)
        {
            await Clients.All.SendAsync("OrderStatusChanged", orderId, status);
        }

        public async Task NotifyNewOrder(int orderId)
        {
            await Clients.All.SendAsync("NewOrderReceived", orderId);
        }
    }
}
