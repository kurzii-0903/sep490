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
}