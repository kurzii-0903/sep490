﻿using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessObject.Entities;
using Microsoft.AspNetCore.SignalR;

namespace ManagementAPI.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendCreateOrderNotification(NotificationOrderCreateResponse notification)
        {
            await Clients.Group(NotificationGroup.Employee.ToString()).SendAsync("ReceiveNotification", notification);
        }

        //public async Task SendOrderSuccessNotification(NotificationOrderCreateResponse notification)
        //{
        //    await Clients.Group(NotificationGroup.Employee.ToString()).SendAsync("ReceiveNotification", notification);
        //}
        public async Task JoinEmployeeGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, NotificationGroup.Employee.ToString());
        }
    }
}
