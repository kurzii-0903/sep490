using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductCategoryDao : IDao<ProductCategory>
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductCategoryDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get Category by ID
    public async Task<ProductCategory?> GetByIdAsync(int id)
    {
        return await _context.ProductCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.CategoryId == id);
    }
    public async Task<ProductCategory?> GetByNameAsync(string categoryName)
    {
        return await _context.ProductCategories
                             .FirstOrDefaultAsync(c => c.CategoryName.Equals(categoryName));
    }
    // Create a new Category
    public async Task<ProductCategory?> CreateAsync(ProductCategory entity)
    {
        await _context.ProductCategories.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing Category
    public async Task<ProductCategory?> UpdateAsync(ProductCategory entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a Category by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.ProductCategories.FindAsync(id);
        if (category == null)
        {
            return false;
        }

        _context.ProductCategories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all Categories
    public async Task<List<ProductCategory>?> GetAllAsync()
    {
        return await _context.ProductCategories
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of Categories (pagination)
    public async Task<List<ProductCategory>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.ProductCategories
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<ProductCategoryGroup?> CreateGroupAsync(ProductCategoryGroup group)
    { 
        await _context.ProductCategoryGroups.AddAsync(group);
        await _context.SaveChangesAsync();
        return group;
    }
}
