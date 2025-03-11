using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessObject.Repository
{
    public class OrderRepo : IOrderRepo
    {
        private readonly OrderDao _orderDao;
        private readonly OrderDetailDao _orderDetailDao;

        public OrderRepo(MinhXuanDatabaseContext context)
        {
            _orderDao = new OrderDao(context);
            _orderDetailDao = new OrderDetailDao(context);
        }

        #region Order 

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _orderDao.GetByIdAsync(id);
        }

        public async Task<Order?> CreateOrderAsync(Order order)
        {
            return await _orderDao.CreateAsync(order);
        }

        public async Task<Order?> UpdateOrderAsync(Order order)
        {
            return await _orderDao.UpdateAsync(order);
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            return await _orderDao.DeleteAsync(id);
        }

        public async Task<List<Order>?> GetAllOrdersAsync()
        {
            return await _orderDao.GetAllAsync();
        }

        public async Task<List<Order>?> GetOrdersPageAsync(int page, int pageSize)
        {
            return await _orderDao.GetPageAsync(page, pageSize);
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _orderDao.GetByIdAsync(orderId);
            if (order == null)
            {
                return false;
            }

            order.Status = status;
            return await _orderDao.UpdateAsync(order) != null;
        }

        public async Task<List<Order>?> GetOrdersByCustomerIdAsync(int customerId, int page, int pageSize)
        {
            return await _orderDao.GetOrdersByCustomerIdAsync(customerId, page, pageSize);
        }

        public async Task<List<Order>?> GetOrdersByPageAsync(int page, int pageSize)
        {
            return await _orderDao.GetOrdersByPageAsync(page, pageSize);
        }

        public async Task<List<Order>?> SearchAsync(DateTime? startDate, DateTime? endDate, string customerName, int page = 1, int pageSize = 20)
        {
            return await _orderDao.SearchAsync(startDate, endDate, customerName, page, pageSize);
        }

        public async Task<bool> CancelOrderAsync(int orderId)
        {
            var order = await _orderDao.GetByIdAsync(orderId);
            if (order == null || order.Status == "Cancelled" || order.Status == "Shipped")
            {
                return false;
            }

            order.Status = "Cancelled";
            return await _orderDao.UpdateAsync(order) != null;
        }

        public async Task<int> CountOrdersAsync()
        {
            return await _orderDao.CountAsync();
        }

        #endregion Order 

        #region OrderDetail 

        public async Task<OrderDetail?> GetOrderDetailByIdAsync(int orderDetailId)
        {
            return await _orderDetailDao.GetByIdAsync(orderDetailId);
        }

        public async Task<OrderDetail?> CreateOrderDetailAsync(OrderDetail orderDetail)
        {
            return await _orderDetailDao.CreateAsync(orderDetail);
        }

        public async Task<OrderDetail?> UpdateOrderDetailAsync(int orderId, OrderDetail orderDetail)
        {
            return await _orderDetailDao.UpdateOrderDetailAsync(orderId, orderDetail);
        }

        public async Task<bool> DeleteOrderDetailAsync(int orderDetailId)
        {
            return await _orderDetailDao.DeleteAsync(orderDetailId);
        }

        public async Task<List<OrderDetail>?> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1, int pageSize = 20)
        {
            return await _orderDetailDao.GetOrderDetailsByOrderIdAsync(orderId, page, pageSize);
        }

        public async Task<List<OrderDetail>?> SearchOrderDetailsAsync(string searchTerm, int page, int pageSize)
        {
            return await _orderDetailDao.SearchOrderDetailsAsync(searchTerm, page, pageSize);
        }

        public async Task<decimal> CalculateOrderDetailTotalAsync(int orderDetailId)
        {
            var orderDetail = await _orderDetailDao.GetByIdAsync(orderDetailId);
            if (orderDetail == null)
            {
                return 0;
            }

            return orderDetail.Quantity * orderDetail.ProductPrice;
        }

        public Task<List<OrderDetail>?> GetOrderDetailsPageAsync(int orderId, int page, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        public async Task<Order?> PayAsync(Order order)
        {
            return await _orderDao.PayAsync(order);
        }

        public async Task<Order?> GetOrderByIdWithTrackingAsync(int id)
        {
            return await _orderDao.GetByIdWithTrackingAsync(id);
        }

        public async Task<bool> UpdateOrderWithInvoiceAsync(Order order, ICollection<Invoice> invoices)
        {
            return await _orderDao.UpdateOrderWithInvoiceAsync(order, invoices);
        }



        //public async Task<int> CountOrderDetailsByOrderIdAsync(int orderId)
        //{
        //    return await _orderDetailDao.CountAsync(orderId);
        //}

        #endregion OrderDetail 
    }
}