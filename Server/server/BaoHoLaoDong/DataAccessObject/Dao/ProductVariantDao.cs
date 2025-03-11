using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductVariantDao : IDao<ProductVariant>
{
    private readonly MinhXuanDatabaseContext _context;
    public ProductVariantDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }
    public async Task<ProductVariant?> GetByIdAsync(int id)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .FirstOrDefaultAsync(pv => pv.VariantId == id);
    }

    public async Task<ProductVariant?> CreateAsync(ProductVariant entity)
    {
        await _context.ProductVariants.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<ProductVariant?> UpdateAsync(ProductVariant entity)
    {
        var existingProductVariant = await GetByIdAsync(entity.VariantId);
        if (existingProductVariant == null)
        {
            throw new ArgumentException("Product variant not found");
        }
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var productVariant = await GetByIdAsync(id);
        if (productVariant == null)
        {
            return false;
        }
        _context.ProductVariants.Remove(productVariant);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductVariant>> GetByProductIdAsync(int productId)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .Where(pv => pv.ProductId == productId)
            .ToListAsync();
    }

    public async Task<List<ProductVariant>> GetByProductIdAsync(List<int> productIds)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .Where(pv => productIds.Contains(pv.ProductId))
            .ToListAsync();
    }

    public async Task<List<ProductVariant>?> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<List<ProductVariant>?> GetPageAsync(int page, int pageSize)
    {
        throw new NotImplementedException();
    }

    public async Task<List<ProductVariant>> GetProductVariantByIdsAsync(List<int> ids)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .Where(pv => ids.Contains(pv.VariantId))
            .ToListAsync();
    }
}