using BusinessLogicLayer.Mappings.RequestDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface IOrderQueueService
{
     public Task EnqueueOrder(NewOrder order);
     public Task<NewOrder?> DequeueOrder();
}