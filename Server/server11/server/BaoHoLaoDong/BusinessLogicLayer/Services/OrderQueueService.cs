using System.Collections.Concurrent;
using System.Threading.Channels;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;

namespace BusinessLogicLayer.Services;

public class OrderQueueService : IOrderQueueService
{
    private readonly Channel<NewOrder> _orderChannel;
    private readonly ConcurrentDictionary<Guid, TaskCompletionSource<OrderResponse>> _pendingOrders;
    public OrderQueueService()
    {
        _orderChannel = Channel.CreateUnbounded<NewOrder>();
        _pendingOrders = new ConcurrentDictionary<Guid, TaskCompletionSource<OrderResponse>>();
    }

    public async Task<Guid> EnqueueOrder(NewOrder order)
    {
        var tcs = new TaskCompletionSource<OrderResponse>();
        _pendingOrders.TryAdd(order.TrackingId, tcs);
        await _orderChannel.Writer.WriteAsync(order);
        return order.TrackingId;
    }

    public async Task<NewOrder?> DequeueOrder()
    {
        return await _orderChannel.Reader.ReadAsync();
    }
    public void CompleteOrder(Guid orderId, OrderResponse response)
    {
        if (_pendingOrders.TryRemove(orderId, out var tcs))
        {
            tcs.TrySetResult(response);
        }
    }
    public bool TryGetPendingOrder(Guid orderId, out TaskCompletionSource<OrderResponse> tcs)
    {
        return _pendingOrders.TryGetValue(orderId, out tcs);
    }
}