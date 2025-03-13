using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface;

public interface INotificationRepo
{
    Task<List<Notification>?> GetAllByRecipientIdAsync(int userId);
    Task<Notification?> CreateAsync(Notification newNotification);
    Task<List<Notification>?> CreateAsync(List<Notification> newNotifications);
}