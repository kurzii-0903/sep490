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
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(IMapper mapper, INotificationRepository notificationRepository)
    {
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }

    public async Task<List<NotificationResponse>?> GetAllNotificationsAsync(int userId)
    {
        var notifications = await _notificationRepository.GetAllByRecipientIdAsync(userId);
        return _mapper.Map<List<NotificationResponse>?>(notifications);
    }

    public async Task<NotificationResponse?> CreateNewNotificationAsync(NewNotification notification)
    {
        try
        {
            var newNotification = _mapper.Map<Notification>(notification);
            newNotification = await _notificationRepository.CreateAsync(newNotification);
            return _mapper.Map<NotificationResponse?>(newNotification);
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task<List<NotificationResponse>?> GetAllAdminNotiAsync(int recipientId)
    {
        var notifications = await _notificationRepository.GetAllAdminNotiAsync(recipientId,RecipientType.Employee.ToString());
        return _mapper.Map<List<NotificationResponse>?>(notifications);
    }

    public async Task<bool?> MaskAsReadAsync(int notificationId, bool readAll)
    {
        return await _notificationRepository.MaskAsReadAsync(notificationId, readAll);
    }

    public async Task<List<NotificationResponse>?> CreateNewNotificationAsync(List<NewNotification> notifications)
    {
        var newNotification = _mapper.Map<List<Notification>>(notifications);
        foreach (var notification in newNotification)
        {
            notification.CreatedAt = DateTime.Now;
            notification.IsRead = false;
        }
        newNotification = await _notificationRepository.CreateAsync(newNotification);
        return _mapper.Map<List<NotificationResponse>>(newNotification);
    }
    public async Task<List<NotificationResponse>?> GetCustomerNotificationAsync(int? RecipientId, bool? isRead)
    {
        var notifications = await _notificationRepository.GetCustomerNotificationAsync(RecipientId, isRead, RecipientType.Customer.ToString());
        return _mapper.Map<List<NotificationResponse>>(notifications);
    }
}