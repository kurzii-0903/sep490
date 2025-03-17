using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;

namespace DataAccessObject.Repository;

public class NotificationRepo : INotificationRepo
{
    private readonly NotificationDao notificationDao;

    public NotificationRepo(MinhXuanDatabaseContext context)
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

    public async Task<List<Notification>?> GetAllAdminNotiAsync(string recipientType)
    {
        return await notificationDao.GetAllAdminNotiAsync(recipientType);
    }

    public async Task<bool?> MaskAsReadAsync(int notificationId, bool readAll)
    {
        return await notificationDao.MaskAsReadAsync(notificationId, readAll);
    }
}