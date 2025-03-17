using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Services.Interface;

public interface INotificationService
{
    Task<List<NotificationResponse>?> GetAllNotificationsAsync(int userId);
    Task<NotificationResponse?> CreateNewNotificationAsync(NewNotification notification);
    Task<List<NotificationResponse>?> GetAllAdminNotiAsync();
    Task<bool?> MaskAsReadAsync(int notificationId, bool readAll);
    Task<List<NotificationResponse>?> CreateNewNotificationAsync(List<NewNotification> notifications);
}