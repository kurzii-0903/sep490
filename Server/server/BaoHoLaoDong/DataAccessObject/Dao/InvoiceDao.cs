using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class InvoiceDao : IDao<Invoice>
{
    private readonly MinhXuanDatabaseContext _context;

    public InvoiceDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get Receipt by ID
    public async Task<Invoice?> GetByIdAsync(int id)
    {
        return await _context.Invoices
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.InvoiceId == id);
    }

    // Create a new Receipt
    public async Task<Invoice?> CreateAsync(Invoice entity)
    {
        await _context.Invoices.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing Receipt
    public async Task<Invoice?> UpdateAsync(Invoice entity)
    {
        var existingReceipt = await _context.Invoices.FindAsync(entity.InvoiceId);
        if (existingReceipt == null)
        {
            throw new ArgumentException("Receipt not found");
        }

        _context.Invoices.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a Receipt by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var receipt = await _context.Invoices.FindAsync(id);
        if (receipt == null)
        {
            return false;
        }

        _context.Invoices.Remove(receipt);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all Receipts
    public async Task<List<Invoice>?> GetAllAsync()
    {
        return await _context.Invoices
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of Receipts (pagination)
    public async Task<List<Invoice>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.Invoices
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}
