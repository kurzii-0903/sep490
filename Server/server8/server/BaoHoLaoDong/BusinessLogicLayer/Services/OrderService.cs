using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace BusinessLogicLayer.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<OrderService> _logger;
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        public readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IMailService _mailService;
        private readonly IProductService _productService;
        public OrderService(IOrderRepository orderRepository,IProductRepository productRepository,IUserRepository userRepository, 
            INotificationRepository notificationRepository,IProductService productService,
            IMapper mapper, ILogger<OrderService> logger, IConfiguration configuration,
            IMailService mailService)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _logger = logger;
            _productRepository =productRepository;
            _configuration = configuration;
            _productService =productService;
            _userRepository = userRepository;
            _notificationRepository = notificationRepository;
            _mailService = mailService;
        }

        #region Order

        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();

            if (orders == null || !orders.Any())
                return new List<OrderResponse>();

            return _mapper.Map<List<OrderResponse>>(orders);
        }

        public async Task<OrderResponse> CreateNewOrderAsync(NewOrder orderRequest)
        {
            try
            {
                var order = _mapper.Map<Order>(orderRequest);
                order = await _orderRepository.CreateOrderAsync(order);
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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
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
        public async Task<Page<OrderResponse>?> GetOrdersWithStringDateTimeAsync(string? emailOrPhone, string? startDate, string? endDate, string? customerName, string? customerId, string? status, int page = 1, int pageSize = 5)
        {
            try
            {
                DateTime? start = null;
                DateTime? end = null;
                if (!string.IsNullOrEmpty(startDate))
                {
                    start = DateTime.ParseExact(startDate, "ddMMyyyy", CultureInfo.InvariantCulture);
                }
                if (!string.IsNullOrEmpty(endDate))
                {
                    end = DateTime.ParseExact(endDate, "ddMMyyyy", CultureInfo.InvariantCulture);
                    end = end.Value.AddDays(1).AddSeconds(-1);
                }
                if (!string.IsNullOrWhiteSpace(customerName))
                {
                    customerName = customerName.Trim();
                }
                int? id = null;
                if (!string.IsNullOrWhiteSpace(customerId) && Regex.IsMatch(customerId, @"^\d+$"))
                {
                    id = Int32.Parse(customerId);
                }
                var orders = await _orderRepository.SearchAsync(emailOrPhone, start, end, customerName, id, status, page, pageSize);
                var totalOrders = await _orderRepository.CountTotalOrdersByFilter(emailOrPhone, start, end, customerName, id, status);
                //var order1 = orders.FirstOrDefault();
                //var a = _mapper.Map<OrderResponse>(order1);
                var orderPage = new Page<OrderResponse>(_mapper.Map<List<OrderResponse>>(orders), page, pageSize, totalOrders);
                return orderPage;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders with filters - StartDate: {StartDate}, EndDate: {EndDate}, CustomerName: {CustomerName}", startDate, endDate, customerName);
                throw;
            }
        }

        //public async Task<Page<OrderResponse>?> GetOrdersAsync(DateTime? startDate, DateTime? endDate,
        //    string? customerName, int page = 1, int pageSize = 5)
        //{
        //    try
        //    {
        //        if (!string.IsNullOrWhiteSpace(customerName))
        //        {
        //            customerName = RemoveDiacritics(Regex.Replace(customerName.Trim().ToLower(), @"\s+", " "));
        //        }

        //        var orders = await _orderRepo.SearchAsync(startDate, endDate, customerName, page, pageSize);
        //        var totalOrders = await _orderRepo.CountTotalOrdersByFilter(startDate, endDate, customerName);
        //        var orderPage = new Page<OrderResponse>(_mapper.Map<List<OrderResponse>>(orders), page, pageSize,
        //            totalOrders);
        //        return orderPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex,
        //            "Error retrieving orders with filters - StartDate: {StartDate}, EndDate: {EndDate}, CustomerName: {CustomerName}",
        //            startDate, endDate, customerName);
        //        throw;
        //    }
        //}
        public async Task<Page<OrderResponse>?> GetOrdersAsync(DateTime? startDate, DateTime? endDate, string? customerName, int page = 1, int pageSize = 5)
        {
            throw new NotImplementedException();
        }

        public async Task<Page<OrderResponse>?> GetOrdersByDateAsync(string? emailOrPhone, DateTime? startDate, DateTime? endDate,
             int page = 1, int pageSize = 5)
        {
            try
            {
                var orders = await _orderRepository.SearchAsync(emailOrPhone, startDate, endDate, null, null, null, page, pageSize);
                orders = orders.OrderByDescending(o => o.OrderDate).ToList();
                var totalOrders = await _orderRepository.CountTotalOrdersByDate(startDate, endDate);
                var orderPage = new Page<OrderResponse>(_mapper.Map<List<OrderResponse>>(orders), page, pageSize,
                    totalOrders);
                return orderPage;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders between {StartDate} and {EndDate}", startDate, endDate);
                throw;
            }
        }


        public async Task<OrderResponse?> UpdateOrderAsync(int orderId, NewOrder orderRequest)
        {
            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                _mapper.Map(orderRequest, order);
                order = await _orderRepository.UpdateOrderAsync(order);
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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                order.Status = status;
                var result = await _orderRepository.UpdateOrderAsync(order);
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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return false;
                }

                return await _orderRepository.DeleteOrderAsync(orderId);
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
                var orderDetails = await _orderRepository.GetOrderDetailsByOrderIdAsync(orderId);
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

        public async Task<List<OrderDetailResponse>?> GetOrderDetailsByPageAsync(int orderId, int page = 1,
            int pageSize = 20)
        {
            try
            {
                var orderDetails = await _orderRepository.GetOrderDetailsPageAsync(orderId, page, pageSize);
                return _mapper.Map<List<OrderDetailResponse>>(orderDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order details for order ID: {OrderId}", orderId);
                throw;
            }
        }

        public async Task<List<OrderResponse>?> SearchOrdersAsync(string? emailOrPhone, DateTime? startDate, DateTime? endDate,
             string customerName, string status, int page = 1, int pageSize = 20)
        {
            var orders = await _orderRepository.SearchAsync(emailOrPhone, startDate, endDate, customerName, null, status, page, pageSize);

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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order == null || order.Status == "Cancelled" || order.Status == "Shipped")
                {
                    return false;
                }

                order.Status = "Cancelled";
                await _orderRepository.UpdateOrderAsync(order);
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
                return await _orderRepository.CountOrdersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error counting orders.");
                throw;
            }
        }

        public static string RemoveDiacritics(string text)
        {
            string[] vietnameseSigns = new string[]
            {
                "aáàảãạăắằẳẵặâấầẩẫậ", "AÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ",
                "dđ", "DĐ",
                "eéèẻẽẹêếềểễệ", "EÉÈẺẼẸÊẾỀỂỄỆ",
                "iíìỉĩị", "IÍÌỈĨỊ",
                "oóòỏõọôốồổỗộơớờởỡợ", "OÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ",
                "uúùủũụưứừửữự", "UÚÙỦŨỤƯỨỪỬỮỰ",
                "yýỳỷỹỵ", "YÝỲỶỸỴ"
            };

            foreach (var sign in vietnameseSigns)
            {
                foreach (var c in sign.Substring(1))
                {
                    text = text.Replace(c, sign[0]);
                }
            }

            return text;
        }

        #endregion Order

        #region OrderDetail

        public async Task<OrderDetailResponse?> GetOrderDetailByIdAsync(int orderDetailId)
        {
            try
            {
                var orderDetail = await _orderRepository.GetOrderDetailByIdAsync(orderDetailId);
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

        public async Task<List<OrderDetailResponse>?> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1,
            int pageSize = 20)
        {
            try
            {
                var orderDetails = await _orderRepository.GetOrderDetailsByOrderIdAsync(orderId, page, pageSize);
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
                var createdOrderDetail = await _orderRepository.CreateOrderDetailAsync(orderDetail);
                return MapToOrderDetailResponse(createdOrderDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating OrderDetail.");
                throw;
            }
        }

        public async Task<OrderDetailResponse?> UpdateOrderDetailAsync(int orderDetailId,
            NewOrderDetail orderDetailRequest)
        {
            try
            {
                var existingOrderDetail = await _orderRepository.GetOrderDetailByIdAsync(orderDetailId);

                if (existingOrderDetail == null)
                {
                    return null;
                }

                existingOrderDetail = UpdateOrderDetailFromRequest(existingOrderDetail, orderDetailRequest);

                var updatedOrderDetail = await _orderRepository.UpdateOrderDetailAsync(orderDetailId, existingOrderDetail);

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
                var orderDetail = await _orderRepository.GetOrderDetailByIdAsync(orderDetailId);
                if (orderDetail == null)
                {
                    return false;
                }

                await _orderRepository.DeleteOrderDetailAsync(orderDetailId);
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
                var orderDetail = await _orderRepository.GetOrderDetailByIdAsync(orderDetailId);
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
                //OrderId = request.OrderId,
                ProductId = request.ProductId,
                // ProductName = request.ProductName,
                //ProductPrice = request.ProductPrice,
                // ProductDiscount = request.ProductDiscount,
                Quantity = request.Quantity,
                //TotalPrice = request.Quantity * request.ProductPrice - (request.ProductDiscount ?? 0),
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

        private OrderDetail UpdateOrderDetailFromRequest(OrderDetail existingOrderDetail,
            NewOrderDetail orderDetailRequest)
        {
            existingOrderDetail.Quantity = orderDetailRequest.Quantity;
            //existingOrderDetail.ProductPrice = orderDetailRequest.ProductPrice;
            //existingOrderDetail.ProductDiscount = orderDetailRequest.ProductDiscount;
            return existingOrderDetail;
        }


        #endregion OrderDetail

        public async Task<bool> PayAsync(OrderPaymentResponse model)
        {
            try
            {
                var productIds = model.OrderDetails.Select(od => od.ProductId).Distinct().ToList();
                var products = await _productRepository.GetProductByIdsAsync(productIds);
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
                    /*Invoices = new List<Invoice>
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
                            //Status = "Paid"
                        }
                    }*/
                };

                var orderResponse = await _orderRepository.PayAsync(order);
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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return false;
                }

                order.Status = OrderStatus.Completed.ToString();
                order.UpdatedAt = DateTime.Now;
                // var invoices = order.Invoices;
                //if (invoices == null || !invoices.Any())
                {
                    return false;
                }

                // foreach (var invoice in invoices)
                //   {
                //invoice.Status = InvoiceStatus.Paid.ToString();
                // }
                //return await _orderRepo.UpdateOrderWithInvoiceAsync(order, invoices);
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
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                //if (order == null || order.Invoices?.Any() != true)
                {
                    return String.Empty;
                }
                // var invoices = order.Invoices.FirstOrDefault();
                //return invoices?.ImagePath != null ? invoices.ImagePath : String.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error GetInvoiceImageAsync");
                throw;
            }
        }

        /// <summary>
        ///  create order
        /// author dinh linh
        /// </summary>
        /// <param name="newOrder"></param>
        /// <returns></returns>
         public async Task<OrderResponse?> CreateNewOrderV2Async(NewOrder newOrder) 
        { 
            try 
            { 
                var order = await CreateOrderEntityAsync(newOrder);
                if (order == null) return null;
                order = await _orderRepository.CreateOrderAsync(order);
                if (order == null) return null;
                var products = order.OrderDetails.Select(p => new 
                { 
                    productId = p.ProductId, 
                    variantId = p.VariantId, 
                    quantity = p.Quantity 
                }).ToList();
                bool isStockAvailable = true; 
                var outOfStockProducts = new List<string>();
                
                foreach (var p in products) 
                { 
                    var product = await _productRepository.GetProductByIdAsync(p.productId); 
                    var variant = await _productRepository.GetProductVariantByIdAsync(p.variantId.GetValueOrDefault()); 
                    if (p.variantId != null && p.variantId != 0) 
                    { 
                        if (variant == null || variant.Quantity < p.quantity) 
                        { 
                            isStockAvailable = false; 
                            outOfStockProducts.Add($"Sản phẩm {product.ProductName} {variant?.Size} - {variant?.Color} không đủ hàng."); 
                        } 
                    }
                    else 
                    { 
                        if (product == null || product.Quantity < p.quantity) 
                        { 
                            isStockAvailable = false; 
                            outOfStockProducts.Add($"Sản phẩm {product?.ProductName} không đủ hàng."); 
                        } 
                    }
                }
                if (!isStockAvailable) 
                { 
                    order.Notes = string.Join("; ", outOfStockProducts); 
                    await _orderRepository.UpdateOrderAsync(order);  
                    return _mapper.Map<OrderResponse>(order);
                } 
                foreach (var p in products) 
                { 
                    if (p.variantId != null && p.variantId != 0) 
                    { 
                        var variant = await _productRepository.GetProductVariantByIdAsync(p.variantId.GetValueOrDefault()); 
                        if (variant != null && variant.Quantity > p.quantity) 
                        { 
                            variant.Quantity -= p.quantity; 
                            await _productRepository.UpdateProductVariantAsync(variant); // Cập nhật DB
                        }
                    }
                    else 
                    { 
                        var product = await _productRepository.GetProductByIdAsync(p.productId); 
                        if (product != null && product.Quantity > p.quantity) 
                        { 
                            product.Quantity -= p.quantity; 
                            await _productRepository.UpdateProductAsync(product); // Cập nhật DB
                        } 
                    } 
                }
                return _mapper.Map<OrderResponse>(order);
            }
            catch (Exception ex) 
            { 
                _logger.LogError(ex, "Error creating new order."); 
                return null; 
            } 
        }
        
        public async Task<OrderResponse?> CalculateOrderAsync(NewOrder newOrder)
        {
            try
            {
                var order = await CreateOrderEntityAsync(newOrder) ;
                foreach (var orderDetail in order.OrderDetails)
                {
                    orderDetail.Product = await _productRepository.GetProductByIdAsync(orderDetail.ProductId)?? new Product();
                }
                return _mapper.Map<OrderResponse>(order);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async Task<Order?> CreateOrderEntityAsync(NewOrder newOrder)
        {
            try
            {   
                var cus = await _userRepository.GetCustomerByEmailAsync(newOrder.CustomerEmail??"");
                var order = _mapper.Map<Order>(newOrder);
                if (order.OrderDetails.Any())
                {
                    foreach (var odDetail in order.OrderDetails)
                    {
                        var (product,variant,isStock) = await _productService.CheckStockAsync(odDetail.ProductId,odDetail.VariantId.GetValueOrDefault(0));
                        if (!isStock)
                        {
                            order.Notes += $"{product.ProductName} {(variant != null ? $"{variant.Size} - {variant.Color}" : "")} tồn kho không đủ để lên đơn.";
                        }
                        var price = variant == null ? product.Price :variant.Price; 
                        var discount =  product.Discount; 
                        var tax = newOrder.IsTaxIncluded  ? (product.TotalTax==null?0:product.TotalTax) :0; 
                        var priceAfterDiscount = price * (1 - discount / 100);
                        var finalPrice = priceAfterDiscount * (1 + tax / 100);
                        odDetail.ProductPrice = finalPrice.GetValueOrDefault(0);
                        odDetail.ProductDiscount = discount.GetValueOrDefault(0);
                        odDetail.TotalPrice = finalPrice.GetValueOrDefault(0) * odDetail.Quantity;
                        odDetail.ProductName = product.ProductName;
                        odDetail.VariantId = odDetail.VariantId;
                        odDetail.Size = variant?.Size ;
                        odDetail.Color = variant?.Color;
                        odDetail.ProductTax = product.TotalTax;
                    }
                }
                order.TotalAmount = order.OrderDetails.Sum(od => od.TotalPrice);
                var invoiceNumber = Guid.NewGuid().ToString();
                order.Invoice = new Invoice()
                {
                    InvoiceNumber = invoiceNumber,
                    Amount = order.TotalAmount,
                    PaymentConfirmOfCustomer = false,
                    PaymentMethod = newOrder.PaymentMethod,
                    QrcodeData = $"https://vietqr.co/api/generate/MB/0974841508/VIETQR.CO/{order.TotalAmount}/{invoiceNumber}"
                };
                order.CustomerId = cus?.CustomerId;
                return order;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
