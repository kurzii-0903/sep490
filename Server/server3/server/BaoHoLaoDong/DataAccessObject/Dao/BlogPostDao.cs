using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class BlogPostDao : IDao<BlogPost>
{
    private readonly MinhXuanDatabaseContext _context;

    public BlogPostDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    // Get BlogPost by ID
    public async Task<BlogPost?> GetByIdAsync(int id)
    {
        return await _context.BlogPosts
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.PostId == id);
    }

    // Create a new BlogPost
    public async Task<BlogPost?> CreateAsync(BlogPost entity)
    {
        await _context.BlogPosts.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // Update an existing BlogPost
    public async Task<BlogPost?> UpdateAsync(BlogPost entity)
    {
        var existingBlogPost = await GetByIdAsync(entity.PostId);
        if (existingBlogPost == null)
        {
            throw new ArgumentException("Blog post not found");
        }

        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    // Delete a BlogPost by ID
    public async Task<bool> DeleteAsync(int id)
    {
        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost == null)
        {
            return false;
        }

        _context.BlogPosts.Remove(blogPost);
        await _context.SaveChangesAsync();
        return true;
    }

    // Get all BlogPosts
    public async Task<List<BlogPost>?> GetAllAsync()
    {
        return await _context.BlogPosts
            .AsNoTracking()
            .ToListAsync();
    }

    // Get a page of BlogPosts (pagination)
    public async Task<List<BlogPost>?> GetPageAsync(int page, int pageSize)
    {
      throw new NotImplementedException();
    }

    public async Task<int> CountBlogPostByCategoryAsync(int categoryId)
    {
        return await _context.BlogPosts
            .Where(b=> categoryId ==0 || b.CategoryBlogId == categoryId)
            .CountAsync();
    }
    public async Task<List<BlogPost>?> GetPageAsync(int categoryId,int page, int pageSize)
    {
        return await _context.BlogPosts
            .AsNoTracking()
            .Where(b=> categoryId ==0 || b.CategoryBlogId == categoryId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}
