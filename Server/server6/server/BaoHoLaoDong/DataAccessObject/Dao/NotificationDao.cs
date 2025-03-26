using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class NotificationDao
{
    private readonly MinhXuanDatabaseContext _context;

    public NotificationDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    public async Task<List<Notification>> GetByRecipientIdAsync(int userId)
    {
        return await _context.Notifications.AsNoTracking()
            .Where(u => u.RecipientId == userId)
            .ToListAsync();
    }

    public async Task<Notification?> CreateAsync(Notification newNotification)
    {
        await _context.Notifications.AddAsync(newNotification);
        await _context.SaveChangesAsync();
        return newNotification;
    }

    public async Task<List<Notification>?> CreateAsync(List<Notification> newNotifications)
    {
        await _context.Notifications.AddRangeAsync(newNotifications);
        await _context.SaveChangesAsync();
        return newNotifications;
    }

    public async Task<List<Notification>> GetAllAdminNotiAsync(string recipientType)
    {
        return await _context.Notifications
            .Where(n => n.RecipientType == recipientType)
            .Where(c => c.RecipientId == 1)
            .OrderByDescending(c => c.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<bool?> MaskAsReadAsync(int notificationId, bool readAll)
    {
        if (readAll)
        {
            var allNotifications = await _context.Notifications.Where(n => !n.IsRead).ToListAsync();
            if (!allNotifications.Any()) return false;
            foreach (var notification in allNotifications)
            {
                notification.IsRead = true;
            }
            await _context.SaveChangesAsync();
            return true;
        }
        else
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;
            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
    public async Task<List<Notification>?> GetCustomerNotificationAsync(int? customerid, bool? isRead, string recipientType)
    {
        var query = _context.Notifications.AsQueryable();
        if (customerid != null)
        {
            query = query.Where(x => x.RecipientId == customerid);
        }
        if (isRead != null)
        {
            query = (DbSet<Notification>)query.Where(x => x.IsRead == isRead);
        }
        return await query.OrderByDescending(c => c.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }
}