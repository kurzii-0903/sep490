﻿using System;
using System.Threading.Tasks;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaoHoLaoDongAPIAndReact.Controllers;
[ApiController]
[Route("api/[controller]")]
public class BlogPostController : ControllerBase
{
    private readonly IBlogPostService _blogPostService;
    public BlogPostController(IBlogPostService   blogPostService)
    {
        _blogPostService = blogPostService;
    }
   
    /// <summary>
    /// get blog categories
    /// </summary>
    /// <returns></returns>
    [HttpGet("get-blog-categories")]
    public async Task<IActionResult> GetBlogCategories()
    {
        try
        {
            var blogCategories = await _blogPostService.GetBlogCategoriesAsync();
            return Ok(blogCategories);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// update blog category
    /// </summary>
    /// <param name="blogCategoryRequest"></param>
    /// <returns></returns>
    [HttpPost("create-blog-category")] 
    public async Task<IActionResult> CreateBlogCategory([FromBody] NewBlogCategory blogCategoryRequest)
    {
        try
        {
            var blogCategory = await _blogPostService.CreateBlogCategoryAsync(blogCategoryRequest);
            return Ok(blogCategory);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// update blog category
    /// </summary>
    /// <param name="updateBlogCategory"></param>
    /// <returns></returns>
    [HttpPut("update-blog-category")]
    public async Task<IActionResult> UpdateBlogCategory([FromBody] UpdateBlogCategory updateBlogCategory)
    {
        try
        {
            var blogCategory = await _blogPostService.UpdateBlogCategoryAsync(updateBlogCategory);
            return Ok(blogCategory);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// create new blog post
    /// </summary>
    /// <param name="newBlogPost"></param>
    /// <returns></returns>
    [HttpPost("create-blog")]
    public async Task<IActionResult> CreateBlog([FromForm] NewBlogPost newBlogPost)
    {
        try
        {
            var newPost = await _blogPostService.CreateNewBlogPostAsync(newBlogPost);
            return Ok(newPost);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// get blog by page
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pagesize"></param>
    /// <returns></returns>
    [HttpGet("get-blog-page")]
    public async Task<IActionResult> GetBlogPostPage([FromQuery] int categoryId = 0,[FromQuery] int page=1, [FromQuery]int size=20)
    {
        try
        {
            var blogs = await _blogPostService.GetBlogPostByPageAsync(categoryId,page, size);
            return Ok(blogs);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// update blog
    /// </summary>
    /// <param name="updateBlogPost"></param>
    /// <returns></returns>
    [HttpPut("update-blog")]
    public async Task<IActionResult> UpdateBlogPost([FromForm] UpdateBlogPost updateBlogPost)
    {
        try
        {
            var blogPostResponse = await _blogPostService.UpdateBlogPostAsync(updateBlogPost);
            return Ok(blogPostResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// delete blog
    /// </summary>
    /// <param name="id"></param>
    /// <returns>bool</returns>
    [HttpDelete("delete-blog/{id}")]
    public async Task<IActionResult> DeleteBlog([FromRoute] int id)
    {
        try
        {
            var result = await _blogPostService.DeleteBlogPostAsync(id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpGet("get-blog/{id}")]
    public async Task<IActionResult> GetBlog([FromRoute] int id)
    {
        try
        {
            var blog = await _blogPostService.GetBlogPostByIdAsync(id);
            return Ok(blog);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [HttpGet("get-blog-by-slug/{slug}")]
    public async Task<IActionResult> GetBlogBySlug([FromRoute] string slug)
    {
        try
        {
            var blog = await _blogPostService.GetBlogPostBySlugAsync(slug);
            return Ok(blog);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }  
    [HttpGet("search-blog")]
    public async Task<IActionResult> SearchBlog([FromQuery] string title)
    {
        try
        {
            var result = await _blogPostService.SearchBlogPostAsync(title);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("get-blog-by-category/{slug}")]
    public async Task<IActionResult> GetBlogsBySlugOfCategory([FromRoute] string slug)
    {
        try
        {
            var blogs = await _blogPostService.GetBlogPostBySlugCategoryAsync(slug);
            return Ok(blogs);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}