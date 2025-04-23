using System.Diagnostics;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BusinessLogicLayer.Services;

public class BlogPostService : IBlogPostService
{
    private readonly IBlogPostRepository _blogPostRepository;
    private readonly string _imagePathBlog = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","images","blogs");
    private readonly IMapper _mapper;
    private readonly ILogger<BlogPostService> _logger;
    private readonly IFileService _fileService;
    public BlogPostService(IBlogPostRepository blogPostRepository, IFileService fileService,IMapper mapper,ILogger<BlogPostService> logger)
    {
        _blogPostRepository = blogPostRepository;
        _fileService = fileService;
        _mapper = mapper;
        _logger = logger;
    }
    public async Task<BlogPostResponse> CreateNewBlogPostAsync(NewBlogPost newBlogPost)
    {
        try
        {
            var blogPost = _mapper.Map<BlogPost>(newBlogPost);
            var file = newBlogPost.File;
            if (file != null && file.Length>0)
            {
                var fileName = await _fileService.SaveImageAsync(_imagePathBlog,file);
                blogPost.FileName = fileName;
            }
            blogPost.Slug = GenerateSlug(blogPost.Title);
            blogPost = await _blogPostRepository.CreateBlogPostAsync(blogPost);
            return _mapper.Map<BlogPostResponse>(blogPost);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while save blogpost");
            throw;
        }
    }
    public async Task<List<BlogPostResponse>?> SearchBlogPostAsync(string title)
    {
        try
        {
            var blogPosts = await _blogPostRepository.SearchBlogPostAsync(title);
            return _mapper.Map<List<BlogPostResponse>>(blogPosts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while searching blog posts");
            throw;
        }
    }


    public async Task<Page<BlogPostResponse>?> GetBlogPostByPageAsync(int categoryId =0,int page = 0, int pageSize = 5)
    {
        try
        {
            var blogs = await _blogPostRepository.GetBlogPostsPageAsync(categoryId,page, pageSize);
            blogs = blogs.OrderByDescending(b => b.CreatedAt).ToList();
            var totalBlogPosts = await _blogPostRepository.CountBlogPostByCategoryAsync(categoryId) ;
            var blogPage = new Page<BlogPostResponse>(_mapper.Map<List<BlogPostResponse>>(blogs), page, pageSize, totalBlogPosts);
            return blogPage;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while get blogpost by page");
            throw;
        }
    }

    public async Task<BlogPostResponse?> UpdateBlogPostAsync(UpdateBlogPost updateBlogPost)
    {
        try
        {
            var blogPostExit = await _blogPostRepository.GetBlogPostByIdAsync(updateBlogPost.Id);
            _mapper.Map(updateBlogPost, blogPostExit);
            var newFile = updateBlogPost.File;
            if (newFile != null && newFile.Length > 0)
            {
                var oldFileName = blogPostExit.FileName;
                var fileName = await _fileService.SaveImageAsync(_imagePathBlog, newFile);
                blogPostExit.FileName = fileName;
                await _fileService.DeleteFileAsync(Path.Combine(_imagePathBlog,oldFileName));
            }

            blogPostExit.Slug = GenerateSlug(blogPostExit.Title);
            blogPostExit = await _blogPostRepository.UpdateBlogPostAsync(blogPostExit);
            return _mapper.Map<BlogPostResponse>(blogPostExit);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while update blog");
            throw;
        }
    }

    public async Task<bool?> DeleteBlogPostAsync(int id)
    {
        try
        {
            var blogPostExit = await _blogPostRepository.GetBlogPostByIdAsync(id);
            var fileName = blogPostExit.FileName;
            var pathImage = Path.Combine(_imagePathBlog, fileName);
            var result = await _blogPostRepository.DeleteBlogPostAsync(id);
            await _fileService.DeleteFileAsync(pathImage);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while delete blog");
            throw;
        }
    }

    public async Task<List<BlogCategoryResponse>?> GetBlogCategoriesAsync()
    {
        try
        {
            var blogCategories = await _blogPostRepository.GetBlogCategoriesAsync();
            return _mapper.Map<List<BlogCategoryResponse>>(blogCategories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while get blog categories");
            throw;
        }
    }
    public async Task<BlogCategoryResponse?> CreateBlogCategoryAsync(NewBlogCategory blogCategoryRequest)
    {
        try
        {
            var blogCategory = _mapper.Map<BlogCategory>(blogCategoryRequest);
            blogCategory.Slug = GenerateSlug(blogCategory.CategoryName);
            blogCategory = await _blogPostRepository.CreateBlogCategoryAsync(blogCategory);
            return _mapper.Map<BlogCategoryResponse>(blogCategory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while create blog category");
            throw;
        }
    }
    public async Task<BlogCategoryResponse?> UpdateBlogCategoryAsync(UpdateBlogCategory updateBlogCategory)
    {
        try
        {
            var blogCategory = await _blogPostRepository.GetBlogCategoryByIdAsync(updateBlogCategory.Id);
            _mapper.Map(updateBlogCategory, blogCategory);
            blogCategory.Slug = GenerateSlug(blogCategory.CategoryName);
            blogCategory = await _blogPostRepository.UpdateBlogCategoryAsync(blogCategory);
            return _mapper.Map<BlogCategoryResponse>(blogCategory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while update blog category");
            throw;
        }
    }

    public async Task<BlogPostResponse?> GetBlogPostByIdAsync(int id)
    {
        try
        {
            var blogPost = await _blogPostRepository.GetBlogPostByIdAsync(id);
            return _mapper.Map<BlogPostResponse>(blogPost);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error while get blog post");
            throw;
        }
    }

    public async Task<BlogPostResponse?> GetBlogPostBySlugAsync(string slug)
    {
        try
        {
            var blog = await _blogPostRepository.GetBlogPostBySlugAsync(slug);
            return _mapper.Map<BlogPostResponse>(blog);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<List<BlogPostResponse>?> GetBlogPostBySlugCategoryAsync(string slug)
    {
        try
        {
            var blogs = await _blogPostRepository.GetBlogPostBySlugCategoryAsync(slug);
            return _mapper.Map<List<BlogPostResponse>>(blogs);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return "";

        // Chuẩn hóa chuỗi, bỏ dấu tiếng Việt
        text = text.Normalize(NormalizationForm.FormD);
        StringBuilder sb = new StringBuilder();
        foreach (char c in text)
        {
            UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory(c);
            if (uc != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        string normalizedString = sb.ToString().Normalize(NormalizationForm.FormC);

        // Chuyển thành chữ thường và thay "đ" thành "d"
        normalizedString = normalizedString.ToLower().Replace("đ", "d");

        // Thay khoảng trắng và các ký tự đặc biệt bằng "-"
        normalizedString = Regex.Replace(normalizedString, @"\s+", "-"); // Thay khoảng trắng
        normalizedString = Regex.Replace(normalizedString, @"[^a-z0-9-]", ""); // Xóa ký tự không hợp lệ

        // Loại bỏ dấu "-" dư thừa ở đầu và cuối
        normalizedString = normalizedString.Trim('-');

        return normalizedString;
    }
}