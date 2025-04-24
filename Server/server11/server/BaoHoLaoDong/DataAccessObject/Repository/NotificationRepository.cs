using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;

namespace DataAccessObject.Repository;

public class NotificationRepository : INotificationRepository
{
    private readonly NotificationDao notificationDao;

    public NotificationRepository(MinhXuanDatabaseContext context)
    {
        notificationDao = new NotificationDao(context);
    }

    public async Task<List<Notification>?> GetAllByRecipientIdAsync(int userId)
    {
        return await notificationDao.GetByRecipientIdAsync(userId);
    }

    public async Task<Notification?> CreateAsync(Notification newNotification)
    {
        return await notificationDao.CreateAsync(newNotification);
    }

    public async Task<List<Notification>?> CreateAsync(List<Notification> newNotifications)
    {
        return await notificationDao.CreateAsync(newNotifications);
    }

    public async Task<List<Notification>?> GetAllAdminNotiAsync(int recipientId,string recipientType)
    {
        return await notificationDao.GetAllAdminNotiAsync(recipientId,recipientType);
    }

    public async Task<bool?> MaskAsReadAsync(int notificationId, bool readAll)
    {
        return await notificationDao.MaskAsReadAsync(notificationId, readAll);
    }
    public async Task<List<Notification>?> GetCustomerNotificationAsync(int? customerid, bool? isRead, string recipientType)
    {
        return await notificationDao.GetCustomerNotificationAsync(customerid, isRead, recipientType);
    }
}