using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessObject.Dao
{
    public class BlogCategoryDao : IDao<BlogCategory>
    {
        private readonly MinhXuanDatabaseContext _context;

        // Constructor để khởi tạo context
        public BlogCategoryDao(MinhXuanDatabaseContext context)
        {
            _context = context;
        }

        // Lấy BlogCategory theo ID
        public async Task<BlogCategory?> GetByIdAsync(int id)
        {
            return await _context.BlogCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.CategoryBlogId == id);
        }

        // Tạo một BlogCategory mới
        public async Task<BlogCategory?> CreateAsync(BlogCategory entity)
        {
            await _context.BlogCategories.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Cập nhật một BlogCategory
        public async Task<BlogCategory?> UpdateAsync(BlogCategory entity)
        {
            var existingCategory = await GetByIdAsync(entity.CategoryBlogId);
            if (existingCategory == null)
            {
                throw new ArgumentException("Blog category not found");
            }

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }

        // Xóa một BlogCategory theo ID
        public async Task<bool> DeleteAsync(int id)
        {
            var blogCategory = await _context.BlogCategories.FindAsync(id);
            if (blogCategory == null)
            {
                return false;
            }

            _context.BlogCategories.Remove(blogCategory);
            await _context.SaveChangesAsync();
            return true;
        }

        // Lấy tất cả BlogCategories
        public async Task<List<BlogCategory>?> GetAllAsync()
        {
            return await _context.BlogCategories
                .AsNoTracking()
                .ToListAsync();
        }

        // Lấy BlogCategories theo phân trang
        public async Task<List<BlogCategory>?> GetPageAsync(int page, int pageSize)
        {
            return await _context.BlogCategories
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<BlogPost?> GetBySlugAsync(string slug)
        {
            return await _context.BlogPosts
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Slug == slug);
        }

        public async Task<List<BlogPost>> GetBlogPostBySlugOfCategoryAsync(string slug)
        {
            return await _context.BlogPosts
                .AsNoTracking()
                .Include(b=>b.CategoryBlog)
                .Where(b=> string.IsNullOrEmpty(slug)|| b.CategoryBlog.Slug.ToLower().Contains(slug.ToLower()))
                .ToListAsync();
        }
    }
}
