using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface;

public interface INotificationRepo
{
    Task<List<Notification>?> GetAllByRecipientIdAsync(int userId);
    Task<Notification?> CreateAsync(Notification newNotification);
    Task<List<Notification>?> CreateAsync(List<Notification> newNotifications);
    Task<List<Notification>?> GetAllAdminNotiAsync(string recipientType);
    Task<bool?> MaskAsReadAsync(int notificationId, bool readAll);
    Task<List<Notification>?> GetCustomerNotificationAsync(int? customerid, bool? isRead, string v);
}