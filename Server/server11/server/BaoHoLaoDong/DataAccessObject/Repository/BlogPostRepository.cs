﻿using DataAccessObject.Repository.Interface;
using BusinessObject.Entities;
using DataAccessObject.Dao;

namespace DataAccessObject.Repository
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly BlogPostDao _blogPostDao;
        private readonly BlogCategoryDao _blogCategoryDao;

        public BlogPostRepository(MinhXuanDatabaseContext context)
        {
            _blogPostDao = new BlogPostDao(context);
            _blogCategoryDao = new BlogCategoryDao(context);
        }

        public async Task<BlogPost?> GetBlogPostByIdAsync(int id)
        {
            return await _blogPostDao.GetByIdAsync(id);
        }

        public async Task<BlogPost?> CreateBlogPostAsync(BlogPost blogPost)
        {
            return await _blogPostDao.CreateAsync(blogPost);
        }

        public async Task<BlogPost?> UpdateBlogPostAsync(BlogPost blogPost)
        {
            return await _blogPostDao.UpdateAsync(blogPost);
        }

        public async Task<bool> DeleteBlogPostAsync(int id)
        {
            return await _blogPostDao.DeleteAsync(id);
        }

        public async Task<List<BlogPost>?> GetAllBlogPostsAsync()
        {
            return await _blogPostDao.GetAllAsync();
        }

        public async Task<List<BlogPost>?> GetBlogPostsPageAsync(int categoryId,int page, int pageSize)
        {
            return await _blogPostDao.GetPageAsync( categoryId,page, pageSize);
        }
        public async Task<List<BlogCategory>?> GetBlogCategoriesAsync()
        {
            return await _blogCategoryDao.GetAllAsync();
        }
        public async Task<BlogCategory?> CreateBlogCategoryAsync(BlogCategory blogCategory)
        {
            return await _blogCategoryDao.CreateAsync(blogCategory);
        }
        public async Task<BlogCategory?> GetBlogCategoryByIdAsync(int id)
        {
            return await _blogCategoryDao.GetByIdAsync(id);
        }
        public async Task<BlogCategory?> UpdateBlogCategoryAsync(BlogCategory? blogCategory)
        {
            return await _blogCategoryDao.UpdateAsync(blogCategory);
        }

        public async Task<int> CountBlogPostByCategoryAsync(int categoryId)
        {
            return await _blogPostDao.CountBlogPostByCategoryAsync(categoryId);
        }
        public async Task<List<BlogPost>?> SearchBlogPostAsync(string? title = null)
        {
            return await _blogPostDao.SearchBlogPostAsync(title);
        }

        public async Task<BlogPost?> GetBlogPostBySlugAsync(string slug)
        {
            return await _blogCategoryDao.GetBySlugAsync(slug);
        }

        public async Task<List<BlogPost>> GetBlogPostBySlugCategoryAsync(string slug)
        {
            return await _blogCategoryDao.GetBlogPostBySlugOfCategoryAsync(slug);
        }
    }
}
