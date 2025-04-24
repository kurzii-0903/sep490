using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface IOrderQueueService
{
     public Task<Guid> EnqueueOrder(NewOrder order);
     public Task<NewOrder?> DequeueOrder();
     public void CompleteOrder(Guid orderId, OrderResponse response);
     public bool TryGetPendingOrder(Guid orderId, out TaskCompletionSource<OrderResponse> tcs);
}