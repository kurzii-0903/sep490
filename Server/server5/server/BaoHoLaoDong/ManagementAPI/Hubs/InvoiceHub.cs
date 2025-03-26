using Microsoft.AspNetCore.SignalR;

namespace ManagementAPI.Hubs
{
    public class InvoiceHub : Hub
    {
        public async Task SendInvoiceUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveInvoiceUpdate", message);
        }
    }
}
