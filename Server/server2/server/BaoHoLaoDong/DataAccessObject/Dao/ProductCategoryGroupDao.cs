using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductCategoryGroupDao
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductCategoryGroupDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }
    public async Task<List<ProductCategoryGroup>?> GetAllAsync()
    {
        return await _context.ProductCategoryGroups
            .AsNoTracking()
            .Include(p => p.ProductCategories)
            .ToListAsync();
    }

    public async Task<ProductCategoryGroup?> CreateAsync(ProductCategoryGroup group)
    {
       await _context.ProductCategoryGroups.AddAsync(group);
       await _context.SaveChangesAsync();
       return group;
    }

    public async Task<ProductCategoryGroup> UpdateAsync(ProductCategoryGroup group)
    {
        _context.Entry(group).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return group;
    }

    public async Task<ProductCategoryGroup?> GetByIdAsync(int groupGroupId)
    {
        return await _context.ProductCategoryGroups
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.GroupId == groupGroupId);
    }
}