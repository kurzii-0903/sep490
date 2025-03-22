using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public enum InvoiceStatus
    {
        Pending,
        Paid,
        Failed
    }

    public enum OrderStatus
    {
        Pending,
        Processing,
        Completed,
        Cancelled
    }

    public enum RecipientType
    {
        Customer,
        Employee
    }

    public enum NotificationStatus
    {
        Active,
        DeActive
    }

    public enum NotificationGroup
    {
        Employee
    }
}