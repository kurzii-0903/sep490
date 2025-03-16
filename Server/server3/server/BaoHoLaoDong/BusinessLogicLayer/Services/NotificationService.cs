using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
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
        newNotification = await _notificationRepo.CreateAsync(newNotification);
        return _mapper.Map<NotificationResponse?>(newNotification);
    }
}