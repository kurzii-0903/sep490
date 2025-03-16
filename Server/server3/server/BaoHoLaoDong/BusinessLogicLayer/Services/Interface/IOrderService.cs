using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;

namespace BusinessLogicLayer.Services.Interface
{
    public interface IOrderService
    {
        //Order
        Task<List<OrderResponse>> GetAllOrdersAsync();
        Task<OrderResponse> CreateNewOrderAsync(NewOrder orderRequest);
        Task<OrderResponse?> GetOrderByIdAsync(int orderId);
        Task<Page<OrderResponse>?> GetOrdersAsync(DateTime? startDate, DateTime? endDate, string? customerName, int page = 1, int pageSize = 5);
     
        Task<OrderResponse?> UpdateOrderAsync(int orderId, NewOrder orderRequest);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
        Task<bool> DeleteOrderAsync(int orderId);
        Task<decimal> CalculateOrderTotalAsync(int orderId);
        Task<List<OrderDetailResponse>?> GetOrderDetailsByPageAsync(int orderId, int page = 1, int pageSize = 20);
        Task<List<OrderResponse>?> SearchOrdersAsync(DateTime? startDate, DateTime? endDate, string customerName, int page = 1, int pageSize = 20);
        Task<Page<OrderResponse>?> GetOrdersByDateAsync(DateTime? startDate, DateTime? endDate, int page = 1, int pageSize = 5);
        Task<bool> CancelOrderAsync(int orderId);
        Task<int> CountOrdersAsync();



        // OrderDetail
        Task<OrderDetailResponse?> GetOrderDetailByIdAsync(int orderDetailId);
        Task<List<OrderDetailResponse>?> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1, int pageSize = 20);
        Task<OrderDetailResponse?> CreateOrderDetailAsync(NewOrderDetail orderDetailRequest);
        Task<OrderDetailResponse?> UpdateOrderDetailAsync(int orderDetailId, NewOrderDetail orderDetailRequest);
        Task<bool> DeleteOrderDetailAsync(int orderDetailId);
        Task<decimal> CalculateOrderDetailTotalAsync(int orderDetailId);

        #region Payment
        Task<bool> PayAsync(OrderPaymentResponse order);
        Task<bool> ConfirmOrderAsync(int orderId);
        Task<string> GetInvoiceImageAsync(int orderId);
        #endregion

        Task<OrderResponse?> CreateNewOrderV2Async(NewOrder newOrder);
 
    }
}