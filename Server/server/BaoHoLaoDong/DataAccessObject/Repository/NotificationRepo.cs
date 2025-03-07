using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;

namespace DataAccessObject.Repository;

public class NotificationRepo :INotificationRepo
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
}