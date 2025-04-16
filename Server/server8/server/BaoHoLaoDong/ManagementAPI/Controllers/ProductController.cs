using System.Text.RegularExpressions;
using AutoMapper;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.SignalR;
using Exception = System.Exception;

namespace ManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IBlogPostService _blogPostService;
    private readonly IHubContext<ProductHub> _productHub;
    private readonly IMapper _mapper;
    private List<string> topics = new List<string>()
    {
        "top_sale",
        "top_deal"
    };
    public ProductController(IProductService productService, IBlogPostService blogPostService,
        IHubContext<ProductHub> productHub, IMapper mapper)
    {
        _productService = productService;
        _blogPostService = blogPostService;
        _productHub = productHub;
        _mapper = mapper;
    }

    /// <summary>
    /// Tạo danh mục sản phẩm mới
    /// </summary>
    [HttpPost("create-category")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateNewCategory([FromBody] NewProductCategory productCategory)
    {
        try
        {
            var result = await _productService.CreateNewCategory(productCategory);
            await _productHub.Clients.All.SendAsync("ProductCategoryAdded",result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy danh sách tất cả danh mục sản phẩm
    /// </summary>
    [AllowAnonymous]
    [HttpGet("getall-category")]
    public async Task<IActionResult> GetAllCategory()
    {
        try
        {
            var categories = await _productService.GetAllCategory();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Cập nhật danh mục sản phẩm
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("update-category")]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateProductCategory productCategory)
    {
        try
        {
            var result = await _productService.UpdateCategoryAsync(productCategory);
            if (result != null)
            {
                await _productHub.Clients.All.SendAsync("ProductCategoryUpdated", result);
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Tạo sản phẩm mới
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("create-product")]
    public async Task<IActionResult> CreateProduct([FromForm] NewProduct newProduct)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var product = await _productService.CreateNewProductAsync(newProduct);
            await _productHub.Clients.All.SendAsync("ProductAdded", newProduct);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Errors = new List<string> { ex.Message } });
        }
    }

    /// <summary>
    /// Tạo biến thể sản phẩm mới
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("create-product-variant")]
    public async Task<IActionResult> CreateProductVariant([FromBody] NewProductVariant newProductVariant)
    {
        try
        {
            var product = await _productService.CreateNewProductVariantAsync(newProductVariant);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Cập nhật biến thể sản phẩm
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("update-product-variant")]
    public async Task<IActionResult> UpdateProductVariant([FromBody] UpdateProductVariant updateProductVariant)
    {
        try
        {
            var product = await _productService.UpdateProductVariantAsync(updateProductVariant);
            await _productHub.Clients.All.SendAsync("ProductUpdated", product);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy danh sách sản phẩm theo trang
    /// </summary>
    [AllowAnonymous]
    [EnableQuery]
    [HttpGet("get-product-page")]
    public async Task<IActionResult> GetProductPage([FromQuery]int group=0,[FromQuery] int category = 0, [FromQuery] int page = 1, [FromQuery] int pagesize = 20)
    {
        try
        {
            var pageResult = await _productService.GetProductByPage(group,category, page, pagesize);
            return Ok(pageResult);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    
    /// <summary>
    /// Cập nhật thông tin sản phẩm
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("update-product")]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProduct updateProduct)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var product = await _productService.UpdateProductAsync(updateProduct);
            if (product != null)
            {
                await _productHub.Clients.All.SendAsync("ProductUpdated", product);
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Errors = new List<string> { ex.Message } });
        }
    }

    /// <summary>
    /// Lấy thông tin sản phẩm theo ID
    /// </summary>
    [AllowAnonymous]
    [HttpGet("get-product-by-id/{id}")]
    public async Task<IActionResult> GetProductById([FromRoute] int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("get-product-by-slug/{slug}")]
    public async Task<IActionResult> GetProductBySlug([FromRoute] string slug)
    {
        try
        {
            var product = await _productService.GetProductBySlugAsync(slug);
            if(product!=null)
              return Ok(product);
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("get-product-by-slug-for-page-detail/{slug}")]
    public async Task<IActionResult> GetProductBySlugForPageDetail([FromRoute] string slug,[FromQuery] int size=20)
    {
        try
        {
            var product = await _productService.GetProductBySlugAsync(slug);
            if (product != null)
            {
                var topSaleProducts = await _productService.GetTopSaleProduct(1, size)??new List<ProductResponse>();
                var relatedProducts = await _productService.GetRelatedProducts(product.Id,size)?? new List<ProductResponse>();
                var review = await _productService.GetReviewAsync(product.Id,size);
                var blogTransport = await _blogPostService.GetBlogPostBySlugAsync("chinh-sach-van-chuyen")?? new BlogPostResponse();
                return Ok(new ProductDetailPage()
                {
                    Product = product,
                    TopSaleProducts = topSaleProducts,
                    RelatedProducts = relatedProducts,
                    Review = review,
                    BlogTransport = blogTransport,
                });
            }
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// Cập nhật hình ảnh sản phẩm
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("update-image")]
    public async Task<IActionResult> UpdateImage([FromForm] UpdateProductImage updateProductImage)
    {
        try
        {
            var result = await _productService.UpdateProductImageAsync(updateProductImage);
            await _productHub.Clients.All.SendAsync("ProductUpdated", result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// delete image product
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete("delete-image/{id}")]
    public async Task<IActionResult> DeleteImage([FromRoute] int id)
    {
        try
        {
            var result = await _productService.DeleteImageAsync(id);
            await _productHub.Clients.All.SendAsync("ProductUpdated", result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    /// <summary>
    /// Tìm kiếm sản phẩm theo tiêu đề
    /// </summary>
    [AllowAnonymous]
    [HttpGet("search-product")]
    public async Task<IActionResult> SearchProduct([FromQuery] string title)
    {
        try
        {
            var result = await _productService.SearchProductAsync(title);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("create-image")]
    public async Task<IActionResult> CreateImage([FromForm] NewProductImage productImage)
    {
        try
        {
            var productResult = await _productService.CreateNewProductImageAsync(productImage);
            if (productResult != null)
            {
                await _productHub.Clients.All.SendAsync("ProductUpdated", productResult);
            }
            return Ok(productResult);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("add-tax")]
    public async Task<IActionResult> AddTax([FromBody] NewProductTax productTax)
    {
        try
        {
            var productResult = await _productService.AddTaxProductAsync(productTax);
            if (productResult != null)
            {
                return Ok(productResult);
            }

            return BadRequest("Tax added");
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("remove-tax")]
    public async Task<IActionResult> RemoveTax(int productTaxid)
    {
        try
        {
            var result = await _productService.DeleteTaxAsync(productTaxid);
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    /// <summary>
    /// search product for customer
    /// </summary>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpGet("filter-product")]
    public async Task<IActionResult> FilterProducts( List<int?> categories)
    {
        try
        {
            var products = await _productService.FilterProductsAsync(categories);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("create-group-category")]
    public async Task<IActionResult> CreateGroupCategory([FromBody] NewGroupCategory groupCategory)
    {
        try
        {
            var result = await _productService.CreateNewGroupCategoryAsync(groupCategory);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("update-group-category")]
    public async Task<IActionResult> UpdateGroupCategory([FromBody] UpdateGroupCategory groupCategory)
    {
        try
        {
            var result = await _productService.UpdateGroupCategoryAsync(groupCategory);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("top-deal")]
    public async Task<IActionResult> TopDeal([FromQuery] int size = 10,[FromQuery] int minDiscountPercent =10)
    {
        try
        {
            var products = await _productService.GetTopDealProductAsync(size,minDiscountPercent);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("top-product-group")]
    public async Task<IActionResult> TopProductGroup([FromQuery] int size)
    {
        try
        {
            var groups = await _productService.GetAllCategory();
            var result = new List<object>();
            if (groups != null)
            {
                foreach (var g in groups)
                {
                    var topProducts = await _productService.GetProductByPage(g.GroupId, 0, 1, size);
                    if (topProducts != null)
                    {
                        result.Add(new
                        {
                            groupName = g.GroupName,
                            products = topProducts.Items
                        });
                    }
                }
            }
            return Ok(result); // Trả về danh sách group + product
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("related")]
    public async Task<IActionResult> RelatedProducts([FromQuery] int size ,[FromQuery] int id)
    {
        try
        {
            var products = await _productService.GetRelatedProducts(id, size);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("reviews")]
    public async Task<IActionResult> Reviews([FromQuery] int size,[FromQuery] int id)
    {
        try
        {
            var review = await _productService.GetReviewAsync(id, size);
            return Ok(review);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpPost("feedback")]
    public async Task<IActionResult> FeedBack([FromBody] NewFeedBack feedBack)
    {
        try
        {
            var feedback= await _productService.SendFeedBackAsync(feedBack);
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("get-products-by-topic")]
    public async Task<IActionResult> GetProductByTopic([FromQuery] string topic,[FromQuery] int page,[FromQuery] int size)
    {
        try
        {
            var products = new List<ProductResponse>();
            switch (topic)
            {
                case "top_sale":
                    products = await _productService.GetTopSaleProduct(page,size);
                    break;
                case "top_deal":
                    products = await _productService.GetTopDealProductAsync(page,size);
                    break;
            }
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpGet("get-top-feedbacks")]
    public async Task<IActionResult> GetTopFeedback([FromQuery] int size)
    {
        try
        {
            var feedbacks = await _productService.GetTopFeedBackAsync(size);
            return Ok(feedbacks);
        }
        catch (Exception ex)
        {
            return BadRequest();
        }
    }
}
