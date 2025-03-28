using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductImageDao : IDao<ProductImage>
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductImageDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get ProductImage by ID
    public async Task<ProductImage?> GetByIdAsync(int id)
    {
        return await _context.ProductImages
            .AsNoTracking()
            .Include(p=>p.Product)
            .FirstOrDefaultAsync(pi => pi.ProductImageId == id);
    }

    // Create a new ProductImage
    public async Task<ProductImage?> CreateAsync(ProductImage entity)
    {
        await _context.ProductImages.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing ProductImage
    public async Task<ProductImage?> UpdateAsync(ProductImage entity)
    {
        var existingProductImage = await GetByIdAsync(entity.ProductImageId);
        if (existingProductImage == null)
        {
            throw new ArgumentException("Product Image not found");
        }

        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a ProductImage by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var productImage = await _context.ProductImages.FindAsync(id);
        if (productImage == null)
        {
            return false;
        }

        _context.ProductImages.Remove(productImage);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all ProductImages
    public async Task<List<ProductImage>?> GetAllAsync()
    {
        return await _context.ProductImages
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of ProductImages (pagination)
    public async Task<List<ProductImage>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.ProductImages
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}
