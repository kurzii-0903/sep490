using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductDao : IDao<Product>
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get Product by ID
    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p=>p.Category)
            .Include(p=>p.ProductImages)
            .Include(p=>p.ProductReviews)
            .Include(p=>p.ProductVariants)
            .Include(p=>p.ProductTaxes).ThenInclude(t=>t.Tax)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductId == id);
    }
    public async Task<Product?> GetByNameAsync(string productName)
    {
        return await _context.Products
                             .FirstOrDefaultAsync(p => p.ProductName.Equals(productName));
    }

    // Create a new Product
    public async Task<Product?> CreateAsync(Product entity)
    {
        await _context.Products.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing Product
    public async Task<Product?> UpdateAsync(Product entity)
    {
        var existingProduct = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .Include(p => p.ProductReviews)
            .Include(p => p.ProductVariants)
            .FirstOrDefaultAsync(p=>p.ProductId == entity.ProductId);
        if (existingProduct == null)
        {
            throw new ArgumentException("Product not found");
        }
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a Product by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all Products
    public async Task<List<Product>?> GetAllAsync()
    {
        return await _context.Products
            .Include(p=>p.Category)
            .Include(p=>p.ProductImages)
            .Include(p=>p.ProductReviews)
            .Include(p=>p.ProductVariants)
            .Include(p=>p.ProductTaxes).ThenInclude(t=>t.Tax)
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of Products (pagination)
    public async Task<List<Product>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p=>p.Category)
            .Include(p=>p.ProductImages)
            .Include(p=>p.ProductReviews)
            .Include(p=>p.ProductVariants)
            .Include(p=>p.ProductTaxes).ThenInclude(t=>t.Tax)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    public async Task<List<Product>?> GetPageAsync(int group, int category, int page, int pageSize)
    {
        IQueryable<Product> query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderByDescending(p => p.IsPrimary))
            .Include(p => p.ProductReviews)
            .Include(p => p.ProductVariants)
            .Include(p => p.ProductTaxes).ThenInclude(t => t.Tax);
        // Chỉ lọc nếu group > 0
        if (group > 0)
            query = query.Where(p => p.Category.GroupId == group);
        // Chỉ lọc nếu category > 0
        if (category > 0)
            query = query.Where(p => p.CategoryId == category);
        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountProductByCategory(int group, int category)
    {
        return await _context.Products.CountAsync(p => 
            (group == 0 || p.Category.GroupId == group) && 
            (category == 0 || p.CategoryId == category)
        );
    }


    public async Task<List<Product>> GetProductByCategory(List<int?> categories)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p=>p.Category)
            .Include(p=>p.ProductImages)
            .Include(p=>p.ProductReviews)
            .Include(p=>p.ProductVariants)
            .Include(p=>p.ProductTaxes)
            .Where(p => categories.Contains(p.CategoryId))
            .ToListAsync();
    }
}
