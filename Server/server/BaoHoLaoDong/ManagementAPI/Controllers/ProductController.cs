using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using ManagementAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.SignalR;

namespace ManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IHubContext<ProductHub> _productHub;
    private readonly IMapper _mapper;

    public ProductController(IProductService productService, IHubContext<ProductHub> productHub, IMapper mapper)
    {
        _productService = productService;
        _productHub = productHub;
        _mapper = mapper;
    }

    /// <summary>
    /// Tạo danh mục sản phẩm mới
    /// </summary>
    [HttpPost("create-category")]
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
    [HttpPost("create-product")]
    public async Task<IActionResult> CreateProduct([FromForm] NewProduct newProduct)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(e => e.Value.Errors.Count > 0)
                    .ToDictionary(e => e.Key, e => e.Value.Errors.Select(err => err.ErrorMessage).ToArray());
                return BadRequest(new
                {
                    Message = "Dữ liệu không hợp lệ!",
                    Errors = errors
                });
            }
            var product = await _productService.CreateNewProductAsync(newProduct);
            await _productHub.Clients.All.SendAsync("ProductAdded", newProduct);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Tạo biến thể sản phẩm mới
    /// </summary>
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
    [HttpPut("update-product")]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProduct updateProduct)
    {
        try
        {
            var product = await _productService.UpdateProductAsync(updateProduct);
            if (product != null)
            {
                await _productHub.Clients.All.SendAsync("ProductUpdated", product);
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy thông tin sản phẩm theo ID
    /// </summary>
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

    /// <summary>
    /// Cập nhật hình ảnh sản phẩm
    /// </summary>
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
    [HttpGet("top-sale-product")]
    public async Task<IActionResult> GetTopSaleProduct([FromQuery] int size =10)
    {
        try
        {
            var result = await _productService.GetTopSaleProduct(size);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex);
        }
    }
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
}
