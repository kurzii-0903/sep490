using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;

namespace BusinessLogicLayer.Services;

public class NotificationService : INotificationService
{
    private readonly IMapper _mapper;
    private readonly INotificationRepo _notificationRepo;

    public NotificationService(IMapper mapper, MinhXuanDatabaseContext context)
    {
        _mapper = mapper;
        _notificationRepo = new NotificationRepo(context);
    }

    public async Task<List<NotificationResponse>?> GetAllNotificationsAsync(int userId)
    {
        var notifications = await _notificationRepo.GetAllByRecipientIdAsync(userId);
        return _mapper.Map<List<NotificationResponse>?>(notifications);
    }

    public async Task<NotificationResponse?> CreateNewNotificationAsync(NewNotification notification)
    {
        var newNotification = _mapper.Map<Notification>(notification);
        newNotification.CreatedAt = DateTime.Now;
        newNotification.IsRead = false;
        newNotification.OrderId = notification.OrderId;
        newNotification = await _notificationRepo.CreateAsync(newNotification);
        return _mapper.Map<NotificationResponse?>(newNotification);
    }

    public async Task<List<NotificationResponse>?> GetAllAdminNotiAsync()
    {
        var notifications = await _notificationRepo.GetAllAdminNotiAsync(RecipientType.Employee.ToString());
        return _mapper.Map<List<NotificationResponse>?>(notifications);
    }

    public async Task<bool?> MaskAsReadAsync(int notificationId, bool readAll)
    {
        return await _notificationRepo.MaskAsReadAsync(notificationId, readAll);
    }

    public async Task<List<NotificationResponse>?> CreateNewNotificationAsync(List<NewNotification> notifications)
    {
        var newNotification = _mapper.Map<List<Notification>>(notifications);
        foreach (var notification in newNotification)
        {
            notification.CreatedAt = DateTime.Now;
            notification.IsRead = false;
        }
        newNotification = await _notificationRepo.CreateAsync(newNotification);
        return _mapper.Map<List<NotificationResponse>>(newNotification);
    }
    public async Task<List<NotificationResponse>?> GetCustomerNotificationAsync(int? RecipientId, bool? isRead)
    {
        var notifications = await _notificationRepo.GetCustomerNotificationAsync(RecipientId, isRead, RecipientType.Customer.ToString());
        return _mapper.Map<List<NotificationResponse>>(notifications);
    }
}