using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;

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
     Task<List<ProductResponse>?> GetTopSaleProduct(int size);
     Task<ProductResponse?> AddTaxProductAsync(NewProductTax productTax);
     Task<ProductResponse?> DeleteTaxAsync(int productTaxid);
     Task<List<ProductResponse>?> FilterProductsAsync(List<int?> categories);
     Task<ProductCategoryGroupResponse?> CreateNewGroupCategoryAsync(NewGroupCategory groupCategory);
     Task<ProductCategoryGroupResponse?> UpdateGroupCategoryAsync(UpdateGroupCategory groupCategory);
}