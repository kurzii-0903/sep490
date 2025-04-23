using Microsoft.AspNetCore.SignalR;

namespace BusinessLogicLayer.Hubs;

public class InvoiceHub : Hub
{
    public async Task SendInvoiceUpdate(string message)
    {
        await Clients.All.SendAsync("ReceiveInvoiceUpdate", message);
    }
}