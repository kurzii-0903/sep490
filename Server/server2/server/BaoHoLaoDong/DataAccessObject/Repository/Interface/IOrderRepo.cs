using BusinessObject.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessObject.Repository.Interface
{
    public interface IOrderRepo
    {
        // Order

        Task<Order?> GetOrderByIdAsync(int id);
        Task<Order?> CreateOrderAsync(Order order);
        Task<Order?> UpdateOrderAsync(Order order);
        Task<bool> DeleteOrderAsync(int id);
        Task<List<Order>?> GetAllOrdersAsync();
        Task<List<Order>?> GetOrdersPageAsync(int page, int pageSize);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
        Task<List<OrderDetail>?> GetOrderDetailsPageAsync(int orderId, int page, int pageSize);
        Task<bool> CancelOrderAsync(int orderId);
        Task<List<Order>?> GetOrdersByCustomerIdAsync(int customerId, int page, int pageSize);
        Task<List<Order>?> GetOrdersByPageAsync(int page, int pageSize);
        Task<List<Order>?> SearchAsync(DateTime? startDate, DateTime? endDate, string customerName, int page = 1, int pageSize = 20);

        Task<int> CountOrdersAsync();



        // OrderDetail
        Task<OrderDetail?> GetOrderDetailByIdAsync(int orderDetailId);
        Task<OrderDetail?> CreateOrderDetailAsync(OrderDetail orderDetail);


        Task<OrderDetail?> UpdateOrderDetailAsync(int orderId, OrderDetail orderDetail);

        Task<bool> DeleteOrderDetailAsync(int orderDetailId);
        Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId);
        Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1, int pageSize = 20);
        Task<List<OrderDetail>?> SearchOrderDetailsAsync(string searchTerm, int page, int pageSize);
        Task<decimal> CalculateOrderDetailTotalAsync(int orderDetailId);

        Task<Order?> PayAsync(Order order);
        Task<bool> UpdateOrderWithInvoiceAsync(Order order, ICollection<Invoice> invoices);
    }
}