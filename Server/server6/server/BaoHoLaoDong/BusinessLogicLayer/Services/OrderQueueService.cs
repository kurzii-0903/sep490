using System.Text.Json;
using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using StackExchange.Redis;

namespace BusinessLogicLayer.Services;

public class OrderQueueService : IOrderQueueService
{
    private readonly ConnectionMultiplexer _redis;
    private readonly IDatabase _db;
    private const string OrderQueueKey = "order_queue";

    public OrderQueueService(string redisConnection)
    {
        _redis = ConnectionMultiplexer.Connect(redisConnection);
        _db = _redis.GetDatabase();
    }
    public async Task EnqueueOrder(NewOrder order)
    {
        string orderJson = JsonSerializer.Serialize(order);
        await _db.ListRightPushAsync(OrderQueueKey, orderJson);
    }
    public Task<NewOrder?> DequeueOrder()
    {
        string? orderJson = _db.ListLeftPop(OrderQueueKey);
    
        return Task.FromResult(orderJson != null 
            ? JsonSerializer.Deserialize<NewOrder>(orderJson) 
            : null);
    }
}