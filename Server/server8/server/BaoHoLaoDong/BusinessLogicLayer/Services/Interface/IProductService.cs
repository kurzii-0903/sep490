using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Services.Interface;

public interface IProductService
{
     Task<List<ProductCategoryGroupResponse>?> CreateNewCategory(NewProductCategory productCategory);
     Task<List<ProductCategoryGroupResponse>?> GetAllCategory();
     
     Task<Page<ProductResponse>?> GetProductByPage(int group,int category = 0, int page = 1, int pageSize = 20);
     Task<List<ProductCategoryGroupResponse>?> UpdateCategoryAsync(UpdateProductCategory productCategory);
     Task<ProductResponse> CreateNewProductAsync(NewProduct newProduct);
     Task<int> CountProductByCategory(int category);
     Task<ProductResponse?> UpdateProductAsync(UpdateProduct updateProduct);
     Task<ProductResponse?> UpdateProductImageAsync(UpdateProductImage updateProductImage);
     Task<ProductResponse?> DeleteImageAsync(int id);
     Task<ProductResponse?> CreateNewProductImageAsync(NewProductImage productImage);
     Task<ProductResponse?> CreateNewProductVariantAsync(NewProductVariant newProductVariant);
     Task<ProductResponse?> UpdateProductVariantAsync(UpdateProductVariant updateProductVariant);
     Task<List<ProductResponse>?> SearchProductAsync(string title);
     Task<ProductResponse?> GetProductByIdAsync(int id);
     Task<List<ProductResponse>?> GetTopSaleProduct(int page,int size);
     Task<ProductResponse?> AddTaxProductAsync(NewProductTax productTax);
     Task<ProductResponse?> DeleteTaxAsync(int productTaxid);
     Task<List<ProductResponse>?> FilterProductsAsync(List<int?> categories);
     Task<ProductCategoryGroupResponse?> CreateNewGroupCategoryAsync(NewGroupCategory groupCategory);
     Task<ProductCategoryGroupResponse?> UpdateGroupCategoryAsync(UpdateGroupCategory groupCategory);
     bool IsProductNameExists(string productName);
     Task<List<ProductResponse>?> GetTopDealProductAsync(int page,int size);
     Task<List<ProductResponse>?> GetRelatedProducts(int id, int size);
     Task<Review> GetReviewAsync(int id, int size);
     Task<ProductResponse?> GetProductBySlugAsync(string slug);
     Task<(Product? product, ProductVariant? variant, bool isStock)> CheckStockAsync(int productId, int variantId);
     Task<ProductReviewResponse> SendFeedBackAsync(NewFeedBack feedBack);
     Task<List<ProductReviewResponse>?> GetTopFeedBackAsync(int size);
}