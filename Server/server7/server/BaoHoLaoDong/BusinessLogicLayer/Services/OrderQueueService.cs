using System.Collections.Concurrent;
using System.Threading.Channels;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;

namespace BusinessLogicLayer.Services;

public class OrderQueueService : IOrderQueueService
{
    private readonly Channel<NewOrder> _orderChannel;

    public OrderQueueService()
    {
        _orderChannel = Channel.CreateUnbounded<NewOrder>();
    }

    public async Task EnqueueOrder(NewOrder order)
    {
        await _orderChannel.Writer.WriteAsync(order);
    }

    public async Task<NewOrder?> DequeueOrder()
    {
        return await _orderChannel.Reader.ReadAsync();
    }
}