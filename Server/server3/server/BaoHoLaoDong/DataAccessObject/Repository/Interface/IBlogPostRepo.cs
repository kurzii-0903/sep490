using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface
{
    public interface IBlogPostRepo
    {
        Task<BlogPost?> GetBlogPostByIdAsync(int id);
        Task<BlogPost?> CreateBlogPostAsync(BlogPost blogPost);
        Task<BlogPost?> UpdateBlogPostAsync(BlogPost blogPost);
        Task<bool> DeleteBlogPostAsync(int id);
        Task<List<BlogPost>?> GetAllBlogPostsAsync();
        Task<List<BlogPost>?> GetBlogPostsPageAsync(int categoryId,int page, int pageSize);
        Task<List<BlogCategory>?> GetBlogCategoriesAsync();
        Task<BlogCategory?> CreateBlogCategoryAsync(BlogCategory blogCategory);
        Task<BlogCategory?> GetBlogCategoryByIdAsync(int id);
        Task<BlogCategory?> UpdateBlogCategoryAsync(BlogCategory? blogCategory);
        Task<int> CountBlogPostByCategoryAsync(int categoryId);
    }
}
