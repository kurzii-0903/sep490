using BusinessLogicLayer.Mappings.RequestDTO;
using Microsoft.AspNetCore.SignalR;

namespace BusinessLogicLayer.Hubs;

public class OrderHub : Hub
{
    public async Task SendOrderStatusChanged(int orderId, string status)
    {
        await Clients.All.SendAsync("OrderStatusChanged", orderId, status);
    }

    public async Task SendNewOrderReceived(int orderId)
    {
        await Clients.All.SendAsync("NewOrderReceived", orderId);
    }
    public async Task SendNewOrderCreated(NewOrder createdOrder)
    {
        await Clients.All.SendAsync("NewOrderCreated", createdOrder);
    }

}