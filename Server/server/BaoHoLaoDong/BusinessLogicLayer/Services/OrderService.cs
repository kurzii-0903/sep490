using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using BusinessLogicLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<OrderService> _logger;
        private readonly IOrderRepo _orderRepo;
        private readonly IProductRepo _productRepo;
        private readonly IInvoiceRepo _invoiceRepo;

        public OrderService(MinhXuanDatabaseContext context, IMapper mapper, ILogger<OrderService> logger)
        {
            _orderRepo = new OrderRepo(context);
            _mapper = mapper;
            _logger = logger;
            _productRepo = new ProductRepo(context);
            _invoiceRepo = new InvoiceRepo(context);
        }


        #region Order
        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            var orders = await _orderRepo.GetAllOrdersAsync();

            if (orders == null || !orders.Any())
                return new List<OrderResponse>();

            return _mapper.Map<List<OrderResponse>>(orders);
        }
        public async Task<OrderResponse> CreateNewOrderAsync(NewOrder orderRequest)
        {
            try
            {
                var order = _mapper.Map<Order>(orderRequest);
                order = await _orderRepo.CreateOrderAsync(order);
                return _mapper.Map<OrderResponse>(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new order.");
                throw;
            }
        }

        public async Task<OrderResponse?> GetOrderByIdAsync(int orderId)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return null;
                }

                return _mapper.Map<OrderResponse>(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order with ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<List<OrderResponse>?> GetOrdersByCustomerIdAsync(int customerId, int page = 1, int pageSize = 20)
        {
            try
            {
                var orders = await _orderRepo.GetOrdersByCustomerIdAsync(customerId, page, pageSize);
                return _mapper.Map<List<OrderResponse>>(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders for customer with ID: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<List<OrderResponse>?> GetOrdersByPageAsync(int page = 1, int pageSize = 20)
        {
            try
            {
                var orders = await _orderRepo.GetOrdersByPageAsync(page, pageSize);
                return _mapper.Map<List<OrderResponse>>(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders.");
                throw;
            }
        }

        public async Task<OrderResponse?> UpdateOrderAsync(int orderId, NewOrder orderRequest)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                _mapper.Map(orderRequest, order);
                order = await _orderRepo.UpdateOrderAsync(order);
                return _mapper.Map<OrderResponse>(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order with ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                order.Status = status;
                var result = await _orderRepo.UpdateOrderAsync(order);
                return result != null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for order with ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return false;
                }

                return await _orderRepo.DeleteOrderAsync(orderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order with ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<decimal> CalculateOrderTotalAsync(int orderId)
        {
            try
            {
                var orderDetails = await _orderRepo.GetOrderDetailsByOrderIdAsync(orderId);
                if (orderDetails == null || orderDetails.Count == 0)
                {
                    return 0m;
                }

                decimal total = 0;
                foreach (var detail in orderDetails)
                {
                    total += detail.Quantity * detail.TotalPrice;
                }

                return total;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating order total for order ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<List<OrderDetailResponse>?> GetOrderDetailsByPageAsync(int orderId, int page = 1, int pageSize = 20)
        {
            try
            {
                var orderDetails = await _orderRepo.GetOrderDetailsPageAsync(orderId, page, pageSize);
                return _mapper.Map<List<OrderDetailResponse>>(orderDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order details for order ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<List<OrderResponse>?> SearchOrdersAsync(DateTime? startDate, DateTime? endDate, string customerName, int page = 1, int pageSize = 20)
        {
            var orders = await _orderRepo.SearchAsync(startDate, endDate, customerName, page, pageSize);

            if (orders == null || !orders.Any())
            {
                return null;
            }

            return _mapper.Map<List<OrderResponse>>(orders);
        }
        public async Task<bool> CancelOrderAsync(int orderId)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null || order.Status == "Cancelled" || order.Status == "Shipped")
                {
                    return false;
                }

                order.Status = "Cancelled";
                await _orderRepo.UpdateOrderAsync(order);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error canceling order with ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<int> CountOrdersAsync()
        {
            try
            {
                return await _orderRepo.CountOrdersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error counting orders.");
                throw;
            }
        }
        #endregion Order

        #region OrderDetail
        public async Task<OrderDetailResponse?> GetOrderDetailByIdAsync(int orderDetailId)
        {
            try
            {
                var orderDetail = await _orderRepo.GetOrderDetailByIdAsync(orderDetailId);
                if (orderDetail == null)
                {
                    return null;
                }
                return MapToOrderDetailResponse(orderDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving OrderDetail with ID: {OrderDetailId}", orderDetailId);
                throw;
            }
        }
        public async Task<List<OrderDetailResponse>?> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1, int pageSize = 20)
        {
            try
            {
                var orderDetails = await _orderRepo.GetOrderDetailsByOrderIdAsync(orderId, page, pageSize);
                return orderDetails?.Select(MapToOrderDetailResponse).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order details for OrderId: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<OrderDetailResponse?> CreateOrderDetailAsync(NewOrderDetail orderDetailRequest)
        {
            try
            {
                var orderDetail = MapToOrderDetail(orderDetailRequest);
                var createdOrderDetail = await _orderRepo.CreateOrderDetailAsync(orderDetail);
                return MapToOrderDetailResponse(createdOrderDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating OrderDetail.");
                throw;
            }
        }

        public async Task<OrderDetailResponse?> UpdateOrderDetailAsync(int orderDetailId, NewOrderDetail orderDetailRequest)
        {
            try
            {
                var existingOrderDetail = await _orderRepo.GetOrderDetailByIdAsync(orderDetailId);

                if (existingOrderDetail == null)
                {
                    return null;
                }

                existingOrderDetail = UpdateOrderDetailFromRequest(existingOrderDetail, orderDetailRequest);

                var updatedOrderDetail = await _orderRepo.UpdateOrderDetailAsync(orderDetailId, existingOrderDetail);

                return MapToOrderDetailResponse(updatedOrderDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating OrderDetail with ID: {OrderDetailId}", orderDetailId);
                throw;
            }
        }

        public async Task<bool> DeleteOrderDetailAsync(int orderDetailId)
        {
            try
            {
                var orderDetail = await _orderRepo.GetOrderDetailByIdAsync(orderDetailId);
                if (orderDetail == null)
                {
                    return false;
                }

                await _orderRepo.DeleteOrderDetailAsync(orderDetailId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting OrderDetail with ID: {OrderDetailId}", orderDetailId);
                throw;
            }
        }
        public async Task<decimal> CalculateOrderDetailTotalAsync(int orderDetailId)
        {
            try
            {
                var orderDetail = await _orderRepo.GetOrderDetailByIdAsync(orderDetailId);
                if (orderDetail == null)
                {
                    return 0m;
                }

                return orderDetail.Quantity * orderDetail.ProductPrice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating total for OrderDetail with ID: {OrderDetailId}", orderDetailId);
                throw;
            }
        }


        private OrderDetail MapToOrderDetail(NewOrderDetail request)
        {
            return new OrderDetail
            {
                OrderId = request.OrderId,
                ProductId = request.ProductId,
                ProductName = request.ProductName,
                ProductPrice = request.ProductPrice,
                ProductDiscount = request.ProductDiscount,
                Quantity = request.Quantity,
                TotalPrice = request.Quantity * request.ProductPrice - (request.ProductDiscount ?? 0),
                CreatedAt = DateTime.Now
            };
        }
        private OrderDetailResponse MapToOrderDetailResponse(OrderDetail orderDetail)
        {
            return new OrderDetailResponse
            {
                OrderDetailId = orderDetail.OrderDetailId,
                OrderId = orderDetail.OrderId,
                ProductId = orderDetail.ProductId,
                ProductName = orderDetail.ProductName,
                ProductPrice = orderDetail.ProductPrice,
                ProductDiscount = orderDetail.ProductDiscount,
                Quantity = orderDetail.Quantity,
                TotalPrice = orderDetail.TotalPrice
            };
        }
        private OrderDetail UpdateOrderDetailFromRequest(OrderDetail existingOrderDetail, NewOrderDetail orderDetailRequest)
        {
            existingOrderDetail.Quantity = orderDetailRequest.Quantity;
            existingOrderDetail.ProductPrice = orderDetailRequest.ProductPrice;
            existingOrderDetail.ProductDiscount = orderDetailRequest.ProductDiscount;
            return existingOrderDetail;
        }

        #endregion OrderDetail

        public async Task<bool> PayAsync(OrderPaymentResponse model)
        {
            try
            {
                var productIds = model.OrderDetails.Select(od => od.ProductId).Distinct().ToList();
                var products = await _productRepo.GetProductByIdsAsync(productIds);
                if (products == null || !products.Any())
                {
                    throw new Exception("Invalid product IDs.");
                }
                foreach (var item in model.OrderDetails)
                {
                    var product = products.FirstOrDefault(p => p.ProductId == item.ProductId);
                    if (product != null)
                    {
                        item.ProductPrice = product.Price;
                        item.ProductDiscount = product.Discount;
                        item.TotalPrice = product.Price * item.Quantity * (1 - (item.ProductDiscount ?? 0) / 100);
                        item.Size = item.Size;
                        item.Color = item.Color;
                        item.ProductName = product.ProductName;
                    }
                }

                var order = new Order
                {
                    CustomerId = model.CustomerId,
                    CustomerInfo = JsonSerializer.Serialize(model.CustomerInfo),
                    TotalAmount = model.TotalPrice,
                    OrderDate = DateTime.Now,
                    Status = OrderStatus.Pending.ToString(),
                    UpdatedAt = DateTime.Now,
                    OrderDetails = model.OrderDetails.Select(od => new OrderDetail
                    {
                        ProductId = od.ProductId,
                        ProductName = od.ProductName,
                        ProductPrice = od.ProductPrice,
                        ProductDiscount = od.ProductDiscount ?? 0,
                        Quantity = od.Quantity,
                        TotalPrice = od.TotalPrice,
                        Size = od.Size,
                        Color = od.Color,
                        CreatedAt = DateTime.Now
                    }).ToList(),
                    Invoices = new List<Invoice>
                    {
                        new Invoice
                        {
                            InvoiceNumber = Guid.NewGuid().ToString(),
                            Amount = model.Invoice.Amount,
                            PaymentMethod = model.Invoice.PaymentMethod,
                            QrcodeData = model.Invoice.QRCodeData,
                            PaymentStatus = InvoiceStatus.Pending.ToString(),
                            ImagePath = model.Invoice.ImagePath,
                            CreatedAt = DateTime.Now,
                            Status = "Paid"
                        }
                    }
                };

                var orderResponse = await _orderRepo.PayAsync(order);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new order.");
                throw;
            }
        }

        public async Task<bool> ConfirmOrderAsync(int orderId)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return false;
                }

                order.Status = OrderStatus.Completed.ToString();
                order.UpdatedAt = DateTime.Now;
                var invoices = order.Invoices;
                if (invoices == null || !invoices.Any())
                {
                    return false;
                }

                foreach (var invoice in invoices)
                {
                    invoice.Status = InvoiceStatus.Paid.ToString();
                }
                return await _orderRepo.UpdateOrderWithInvoiceAsync(order,invoices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating invoice status for order ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<string> GetInvoiceImageAsync(int orderId)
        {
            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null || order.Invoices?.Any() != true)
                {
                    return String.Empty;
                }
                var invoices = order.Invoices.FirstOrDefault();
                return invoices?.ImagePath != null ? invoices.ImagePath : String.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error GetInvoiceImageAsync");
                throw;
            }
        }
    }
}