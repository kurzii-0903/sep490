
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
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace BusinessLogicLayer.Services;

public class ProductService : IProductService
{
    private readonly IMapper _mapper;
    private readonly ILogger<ProductService> _logger;
    private readonly IProductRepo _productRepo;
    private readonly ITaxRepo _taxRepo;
    private readonly string _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","images","products");
    private readonly IFileService _fileService;
    public ProductService(IProductRepo productRepo,ITaxRepo taxRepo, IMapper mapper, ILogger<ProductService> logger,IFileService fileService)
    {
        _productRepo = productRepo;
        _mapper = mapper;
        _logger = logger;
        _fileService = fileService;
        _taxRepo = taxRepo;
    }


    public async Task<List<ProductCategoryGroupResponse>?> CreateNewCategory(NewProductCategory newProductCategory)
    {
        var category = _mapper.Map<ProductCategory>(newProductCategory);
        category = await _productRepo.CreateCategoryAsync(category);
        var groups = await _productRepo.GetAllCategoriesAsync();
        return _mapper.Map<List<ProductCategoryGroupResponse>>(groups);
    }

    public async Task<List<ProductCategoryGroupResponse>?> GetAllCategory()
    {
        var categories = await _productRepo.GetAllCategoriesAsync();
        return _mapper.Map<List<ProductCategoryGroupResponse>>(categories);
    }

    public async Task<Page<ProductResponse>?> GetProductByPage(int group,int category = 0, int page = 1, int pageSize = 20)
    {
        var products = await _productRepo.GetProductPageAsync(group,category, page, pageSize);
        var totalProduct = await _productRepo.CountProductByCategory(group,category);
        var productsResponse = _mapper.Map<List<ProductResponse>>(products);
        var pageResult = new Page<ProductResponse>(productsResponse, page, pageSize, totalProduct);
        _logger.LogInformation("getproducts",pageResult);
        return pageResult;
    }

    public async Task<List<ProductCategoryGroupResponse>?> UpdateCategoryAsync(UpdateProductCategory updateProductCategory)
    {
        try
        {
            var category = await _productRepo.GetCategoryByIdAsync(updateProductCategory.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found.");
            }

            _mapper.Map(updateProductCategory, category);
            category = await _productRepo.UpdateCategoryAsync(category);
            var groups = await _productRepo.GetAllCategoriesAsync();
            return _mapper.Map<List<ProductCategoryGroupResponse>>(groups);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category with ID: {CategoryId}", updateProductCategory.CategoryId);
            throw;
        }
    }

    public async Task<ProductResponse> CreateNewProductAsync(NewProduct newProduct)
    {
        try
        {
            var product = _mapper.Map<Product>(newProduct);
            product.Slug = GenerateSlug(product.ProductName);
            product = await _productRepo.CreateProductAsync(product);
            var files = newProduct.Files;
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    var fileName = await _fileService.SaveImageAsync(_imageDirectory,file);
                    if (fileName != null)
                    {
                        var productImage = new ProductImage()
                        {
                            ProductId = product.ProductId,
                            FileName = fileName,
                            IsPrimary = (files.IndexOf(file) == 0)?true:false
                        };
                        await _productRepo.CreateProductImageAsync(productImage);
                    }
                }
            }
            product = await _productRepo.GetProductByIdAsync(product.ProductId);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new product.");
            throw ex;
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
    public async Task<int> CountProductByCategory(int category)
    {
        return await _productRepo.CountProductByCategory(0,category);
    }

    public async Task<ProductResponse?> UpdateProductAsync(UpdateProduct updateProduct)
    {
        try
        {
            var product = await _productRepo.GetProductByIdAsync(updateProduct.Id);
            if (product == null)
            {
                throw new Exception("Product not found.");
            }

            _mapper.Map(updateProduct, product);
            product.Slug = GenerateSlug(product.ProductName);
            product = await _productRepo.UpdateProductAsync(product);
            _logger.LogInformation("Update product success");
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product with ID: {ProductId}", updateProduct.Id);
            throw;
        }
    }

  public async Task<ProductResponse?> UpdateProductImageAsync(UpdateProductImage updateProductImage)
{
    IFormFile? file = null;
    string? oldPath = null;
    string? fileName = null;
    try
    {
        // Get the existing product image by its ID
        var productImage = await _productRepo.GetProductImageByIdAsync(updateProductImage.ProductImageId);
        if (productImage == null)
        {
            _logger.LogWarning("Product image with ID: {ProductImageId} not found.", updateProductImage.ProductImageId);
            return null;
        }

        file = updateProductImage.File;

        // Construct the path for the existing image to be deleted later
        oldPath = Path.Combine(_imageDirectory, productImage.FileName);

        // Check if a new file is uploaded
        if (file != null && file.Length > 0)
        {
            // Save the new image and get the new file name
            fileName = await _fileService.SaveImageAsync(_imageDirectory,file);
            if (fileName == null)
            {
                throw new Exception("Failed to save new product image.");
            }

            // Update the product image details with the new file name
            productImage.FileName = fileName;
            productImage.IsPrimary = updateProductImage.IsPrimary;

            // Update the product image in the repository
            var result = await _productRepo.UpdateProductImageAsync(productImage);
            var product = await _productRepo.GetProductByIdAsync(productImage.ProductId);
            if (result != null)
            {
                await _fileService.DeleteFileAsync(oldPath);
            }
            return _mapper.Map<ProductResponse>(product);
        }

        return null;
    }
    catch (Exception ex)
    {
        // Handle unexpected errors
        _logger.LogError(ex, "Error updating product image with ID: {ProductImageId}", updateProductImage.ProductImageId);
        // If an error occurs, delete the newly uploaded image if it was partially saved
        if (!string.IsNullOrEmpty(fileName))
        {
            try
            {
                File.Delete(Path.Combine(_imageDirectory, fileName));
                _logger.LogInformation("Deleted partially uploaded image: {NewImagePath}", Path.Combine(_imageDirectory, fileName));
            }
            catch (Exception deleteEx)
            {
                _logger.LogError(deleteEx, "Failed to delete partially uploaded image: {NewImagePath}", Path.Combine(_imageDirectory, fileName));
            }
        }
        throw; 
    }
}


    public async Task<ProductResponse?> DeleteImageAsync(int id)
    {
        try
        {
            var productImageExit = await _productRepo.GetProductImageByIdAsync(id);
            if (productImageExit != null)
            {
                var result =await _productRepo.DeleteProductImageAsync(id);
                var fileName = productImageExit.FileName;
                var oldFilePath = Path.Combine(_imageDirectory, fileName);
                if (File.Exists(oldFilePath) && result)
                {
                    File.Delete(oldFilePath);
                    var product = await _productRepo.GetProductByIdAsync(productImageExit.ProductId);
                    return _mapper.Map<ProductResponse>(product);
                }
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error delete image with ID: " + id);
            throw;
        }
    }

    public async Task<ProductResponse?> CreateNewProductImageAsync(NewProductImage productImage)
    {
        try
        {
            var productExit = await _productRepo.GetProductByIdAsync(productImage.ProductId);
            if (productExit == null) throw new Exception("Product not found");
            var file = productImage.File;
            if (file != null && file.Length > 0)
            {
                var fileName = await _fileService.SaveImageAsync(_imageDirectory,file);
                var newProductImage = new ProductImage()
                {
                    ProductId = productExit.ProductId,
                    FileName = fileName,
                    IsPrimary = productImage.IsPrimary

                };
                newProductImage = await _productRepo.CreateProductImageAsync(newProductImage);
                _logger.LogInformation(newProductImage.ProductImageId.ToString());
                var product = await _productRepo.GetProductByIdAsync(productImage.ProductId);
                return _mapper.Map<ProductResponse>(product);
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Error create new image");
            throw;
        }
    }

    public async Task<ProductResponse?> CreateNewProductVariantAsync(NewProductVariant newProductVariant)
    {
        try
        {
            var productId = newProductVariant.ProductId;
            var product = await _productRepo.GetProductByIdAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found.");
            }
            var productVariant = _mapper.Map<ProductVariant>(newProductVariant);
            productVariant = await _productRepo.CreateProductVariantAsync(productVariant);
            product = await _productRepo.GetProductByIdAsync(productId);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new product variant.");
            throw;
        }
    }

    public async Task<ProductResponse?> UpdateProductVariantAsync(UpdateProductVariant updateProductVariant)
    {
        try
        {
            var productId = updateProductVariant.ProductId;
            var variantId = updateProductVariant.VariantId;
            var productVariant = await _productRepo.GetProductVariantByIdAsync(variantId);
            if (productVariant == null)
            {
                throw new Exception("Product variant not found.");
            }

            _mapper.Map(updateProductVariant, productVariant);
            productVariant = await _productRepo.UpdateProductVariantAsync(productVariant);
            var product = await _productRepo.GetProductByIdAsync(productId);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product variant with ID: {VariantId}", updateProductVariant.VariantId);
            throw;
        }
    }
    public static string RemoveDiacritics(string text)
    {
        string[] vietnameseSigns = new string[]
        {
            "aáàảãạăắằẳẵặâấầẩẫậ", "AÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ",
            "dđ", "DĐ",
            "eéèẻẽẹêếềểễệ", "EÉÈẺẼẸÊẾỀỂỄỆ",
            "iíìỉĩị", "IÍÌỈĨỊ",
            "oóòỏõọôốồổỗộơớờởỡợ", "OÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ",
            "uúùủũụưứừửữự", "UÚÙỦŨỤƯỨỪỬỮỰ",
            "yýỳỷỹỵ", "YÝỲỶỸỴ"
        };

        foreach (var sign in vietnameseSigns)
        {
            foreach (var c in sign.Substring(1))
            {
                text = text.Replace(c, sign[0]);
            }
        }
        return text;
    }

  public async Task<List<ProductResponse>?> SearchProductAsync(string title)
{
    try
    {
        if (string.IsNullOrWhiteSpace(title) || title.Length > 100)
        {
            _logger.LogWarning("Invalid search title: {Title}", title);
            return new List<ProductResponse>();
        }

        // Loại bỏ ký tự đặc biệt
        title = Regex.Replace(title, @"[^\w\s]", "").Trim().ToLower();
        
        // Danh sách từ khóa không hợp lệ
        var forbiddenKeywords = new List<string> { "drop", "delete", "truncate", "script", "select", "insert", "update" };
        if (forbiddenKeywords.Any(keyword => title.Contains(keyword)))
        {
            _logger.LogWarning("Blocked search query due to forbidden keyword: {Title}", title);
            return new List<ProductResponse>();
        }

        // Chuẩn hóa tiêu đề (loại bỏ dấu tiếng Việt)
        title = RemoveDiacritics(Regex.Replace(title, @"\s+", " "));

        // Danh sách từ không có ý nghĩa (stopwords)
        var stopWords = new HashSet<string> { "và", "hoặc", "của", "là", "có", "với", "bởi", "cho", "trong", "một", "những", "các", "the", "an", "or", "is", "on", "at" };

        // Lấy danh sách sản phẩm từ database
        var products = await _productRepo.GetAllProductsAsync() ?? new List<Product>();

        // Tự động tạo danh sách từ khóa hợp lệ từ tên sản phẩm
        var validKeywords = products
            .SelectMany(p => RemoveDiacritics(p.ProductName.ToLower()).Split(' '))
            .Where(word => word.Length > 1 && !stopWords.Contains(word))
            .Distinct()
            .ToHashSet();

        // Tách từ khóa tìm kiếm, chỉ giữ lại từ có trong danh sách hợp lệ
        var keywords = title.Split(' ')
                            .Where(k => validKeywords.Contains(k))
                            .ToList();

        if (!keywords.Any())
        {
            _logger.LogWarning("Search query contains only invalid words: {Title}", title);
            return new List<ProductResponse>();
        }

        // Lọc sản phẩm dựa trên từ khóa hợp lệ
        var filteredProducts = products.Where(p =>
        {
            var productName = RemoveDiacritics(p.ProductName.ToLower());
            return keywords.All(keyword => productName.Contains(keyword));
        }).ToList();

        return _mapper.Map<List<ProductResponse>>(filteredProducts);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error while searching products with title: {Title}", title);
        return new List<ProductResponse>();
    }
}



    public async Task<ProductResponse?> GetProductByIdAsync(int id)
    {
        try
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while get product by id");
            throw;
        }
    }

    public async Task<List<ProductResponse>?> GetTopSaleProduct(int size)
    {
        try
        {
            var products = await _productRepo.GetAllProductsAsync();
            var topSaleProducts = products
                .OrderByDescending(p => p.OrderDetails.Count)
                .Take(size)
                .ToList();
            return _mapper.Map<List<ProductResponse>>(topSaleProducts);
        }catch(Exception ex)
        {
            _logger.LogError(ex, "Error while get top sale product");
            throw;
        }
    }

    public async Task<ProductResponse?> AddTaxProductAsync(NewProductTax newProductTax)
    {
        try
        {
            var productTax = _mapper.Map<ProductTaxis>(newProductTax); 
             productTax = await _productRepo.AddProductTaxAsync(productTax);
             if (productTax != null)
             {
                 var product = await _productRepo.GetProductByIdAsync(newProductTax.ProductId);
                 return _mapper.Map<ProductResponse>(product);
             }
             return null;
        }catch(Exception ex)
        {
            _logger.LogError(ex, "Error while add tax product");
            throw;
        }
    }

    public async Task<ProductResponse?> DeleteTaxAsync(int productTaxid)
    {
        try
        {
            var result = await _productRepo.DeleteProductTaxAsync(productTaxid);
            var product = await _productRepo.GetProductByIdAsync((int)result.ProductId);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while delete tax product");
            throw;
        }
    }

    public async Task<List<ProductResponse>?> FilterProductsAsync(List<int?> categories)
    {
        var products =await _productRepo.FilterProductsAsync(categories);
        return _mapper.Map<List<ProductResponse>>(products);
    }

    public async Task<ProductCategoryGroupResponse?> CreateNewGroupCategoryAsync(NewGroupCategory groupCategory)
    {
        try
        {
            var group = _mapper.Map<ProductCategoryGroup>(groupCategory);
            group = await _productRepo.CreateGroupCategoryAsync(group);
            return _mapper.Map<ProductCategoryGroupResponse>(group);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<ProductCategoryGroupResponse?> UpdateGroupCategoryAsync(UpdateGroupCategory groupCategory)
    {
        try
        {
            var group = _mapper.Map<ProductCategoryGroup>(groupCategory);
            group = await _productRepo.UpdateGroupCategoryAsync(group);
            return _mapper.Map<ProductCategoryGroupResponse>(group);
        }
        catch (Exception ex)
        {
            throw ex;
        }     
    }

    public bool IsProductNameExists(string productName)
    {
        return _productRepo.IsProductNameExists(productName);
    }

    public async Task<List<ProductResponse>?> GetTopDealProductAsync(int size,int minDiscountPercent)
    {
        try
        {
            var products = await _productRepo.GetTopDiscountAsync(size,minDiscountPercent);
            return _mapper.Map<List<ProductResponse>>(products);
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task<List<ProductResponse>?> GetRelatedProducts(int id, int size)
    {
        try
        {
            var products = await _productRepo.GetAllProductsAsync()??new List<Product>();
            var productExit = products.FirstOrDefault(p=>p.ProductId==id)?? null;
            if (productExit == null)  return null;
            products = products.Where(p=>p.Category.GroupId == productExit.Category.GroupId && p.ProductId!=id)
                .OrderBy(x=> Guid.NewGuid())
                .Take(size)
                .ToList();
            return _mapper.Map<List<ProductResponse>>(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            throw;
        }
    }

    public async Task<Review> GetReviewAsync(int id, int size)
    {
        try
        {
            var review = new Review();
            var productExit = await _productRepo.GetProductByIdAsync(id);
            if ( productExit != null)
            {
                review.Star1 = productExit.ProductReviews.Count(r => r.Rating == 1);
                review.Star2 = productExit.ProductReviews.Count(r => r.Rating == 2);
                review.Star3 = productExit.ProductReviews.Count(r => r.Rating == 3);
                review.Star4 = productExit.ProductReviews.Count(r => r.Rating == 4);
                review.Star5 = productExit.ProductReviews.Count(r => r.Rating == 5);
                review.ProductReviews = _mapper.Map<List<ProductReviewResponse>>(productExit.ProductReviews);
            }
            return review;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            throw;
        }
    }

    public async Task<ProductResponse?> GetProductBySlugAsync(string slug)
    {
        try
        {
            var product = await _productRepo.GetProductBySlugAsync(slug);
            return _mapper.Map<ProductResponse>(product);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error while get product by slug");
            throw;
        }
    }

    public async Task<(ProductResponse product, ProductVariantResponse variant, bool isStock)> CheckStockAsync(int productId, int variantId)
    {
        Product product = null;
        ProductVariant variant = null;
        bool isStock = false;

        try
        { 
            product = await _productRepo.GetProductByIdAsync(productId);
            if (product == null)
            {
                throw new KeyNotFoundException($"❌ Không tìm thấy sản phẩm có ID: {productId}");
            }

            variant = product.ProductVariants.FirstOrDefault(v => v.VariantId == variantId);
            if (variant != null)
            {
                isStock = variant.Quantity > 0; // Kiểm tra tồn kho của biến thể
            }
            else
            {
                isStock = product.Quantity > 0; // Nếu không có biến thể, kiểm tra tồn kho sản phẩm gốc
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Lỗi khi kiểm tra tồn kho: {ex.Message}");
        }

        var productResponse = _mapper.Map<ProductResponse>(product);
        var variantResponse = _mapper.Map<ProductVariantResponse>(variant);
        return (productResponse, variantResponse, isStock);
    }

}
