using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class ProductReviewDao : IDao<ProductReview>
{
    private readonly MinhXuanDatabaseContext _context;

    public ProductReviewDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get ProductReview by ID
    public async Task<ProductReview?> GetByIdAsync(int id)
    {
        return await _context.ProductReviews
            .AsNoTracking()
            .FirstOrDefaultAsync(pr => pr.ReviewId == id);
    }
    public async Task<List<ProductReview>> GetByProductIdAsync(int productId)
    {
        return await _context.ProductReviews
                             .Where(pr => pr.ProductId == productId)
                             .ToListAsync();
    }
    // Create a new ProductReview
    public async Task<ProductReview?> CreateAsync(ProductReview entity)
    {
        await _context.ProductReviews.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing ProductReview
    public async Task<ProductReview?> UpdateAsync(ProductReview entity)
    {
        var existingProductReview = await _context.ProductReviews.FindAsync(entity.ReviewId);
        if (existingProductReview == null)
        {
            throw new ArgumentException("Product Review not found");
        }

        _context.ProductReviews.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a ProductReview by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var productReview = await _context.ProductReviews.FindAsync(id);
        if (productReview == null)
        {
            return false;
        }

        _context.ProductReviews.Remove(productReview);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all ProductReviews
    public async Task<List<ProductReview>?> GetAllAsync()
    {
        return await _context.ProductReviews
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of ProductReviews (pagination)
    public async Task<List<ProductReview>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.ProductReviews
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

}
