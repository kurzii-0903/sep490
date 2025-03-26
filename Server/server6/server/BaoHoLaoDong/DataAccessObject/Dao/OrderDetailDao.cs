using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccessObject.Dao;

public class OrderDetailDao : IDao<OrderDetail>
{
    private readonly MinhXuanDatabaseContext _context;

    public OrderDetailDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get OrderDetail by ID
    public async Task<OrderDetail?> GetByIdAsync(int id)
    {
        return await _context.OrderDetails
            .AsNoTracking()
            .FirstOrDefaultAsync(od => od.OrderDetailId == id);
    }

    // Get OrderDetails by OrderId
    public async Task<List<OrderDetail>?> GetByOrderIdAsync(int orderId)
    {
        return await _context.OrderDetails
            .Where(od => od.OrderId == orderId)
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<List<OrderDetail>?> GetOrderDetailsByOrderIdAsync(int orderId, int page = 1, int pageSize = 20)
    {
        var query = _context.OrderDetails.AsQueryable();

        query = query.Where(od => od.OrderId == orderId);

        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    // Create a new OrderDetail
    public async Task<OrderDetail?> CreateAsync(OrderDetail entity)
    {
        await _context.OrderDetails.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing OrderDetail
    public async Task<OrderDetail?> UpdateAsync(OrderDetail entity)
    {
        var existingOrderDetail = await _context.OrderDetails.FindAsync(entity.OrderDetailId);
        if (existingOrderDetail == null)
        {
            throw new ArgumentException("OrderDetail not found");
        }

        _context.OrderDetails.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
    public async Task<OrderDetail?> UpdateOrderDetailAsync(int orderDetailId, OrderDetail orderDetailRequest)
    {
        var existingOrderDetail = await _context.OrderDetails
            .FirstOrDefaultAsync(od => od.OrderDetailId == orderDetailId);

        if (existingOrderDetail == null)
        {
            return null;
        }

        existingOrderDetail.Quantity = orderDetailRequest.Quantity;
        existingOrderDetail.ProductPrice = orderDetailRequest.ProductPrice;
        existingOrderDetail.ProductDiscount = orderDetailRequest.ProductDiscount;

        _context.OrderDetails.Update(existingOrderDetail);
        await _context.SaveChangesAsync();

        return existingOrderDetail;
    }


    // Delete an OrderDetail by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var orderDetail = await _context.OrderDetails.FindAsync(id);
        if (orderDetail == null)
        {
            return false;
        }

        _context.OrderDetails.Remove(orderDetail);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all OrderDetails
    public async Task<List<OrderDetail>?> GetAllAsync()
    {
        return await _context.OrderDetails
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of OrderDetails (pagination)
    public async Task<List<OrderDetail>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.OrderDetails
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    // Get total count of OrderDetails for pagination
    public async Task<int> GetTotalCountAsync()
    {
        return await _context.OrderDetails.CountAsync();
    }

    // Get all Orders by page (pagination for orders)
    public async Task<List<Order>?> GetOrdersByPageAsync(int page, int pageSize)
    {
        return await _context.Orders
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<OrderDetail>?> SearchOrderDetailsAsync(string searchTerm, int page = 1, int pageSize = 20)
    {
        return await _context.OrderDetails
            .Where(od => EF.Functions.Like(od.Product.ProductName, $"%{searchTerm}%") || EF.Functions.Like(od.Order.Customer.FullName, $"%{searchTerm}%"))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<decimal> CalculateOrderTotalAsync(int orderId)
    {
        return await _context.OrderDetails
            .Where(od => od.OrderId == orderId)
            .SumAsync(od => od.Quantity * od.ProductPrice);
    }
    public async Task<List<OrderDetail>?> GetOrderDetailsByOrderIdAsync(int orderId)
    {
        return await _context.OrderDetails
            .Where(od => od.OrderId == orderId)
            .AsNoTracking()
            .ToListAsync();
    }

}