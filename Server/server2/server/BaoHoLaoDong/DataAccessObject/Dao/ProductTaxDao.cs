using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductTaxDao
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductTaxDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }
    public async Task<ProductTaxis?> CreateAsync(ProductTaxis entity)
    {
        await _context.ProductTaxes.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<ProductTaxis?> DeleteAsync(int productTaxid)
    {
        var tax = await _context.ProductTaxes.FindAsync(productTaxid);
        if (tax == null) return tax;
         _context.ProductTaxes.Remove(tax); 
        await _context.SaveChangesAsync() ;
        return tax;
    }
}