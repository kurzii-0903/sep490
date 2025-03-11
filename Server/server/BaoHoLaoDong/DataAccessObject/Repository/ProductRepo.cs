using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessObject.Repository
{
    public class ProductRepo : IProductRepo
    {
        private readonly ProductCategoryDao _productCategoryDao;
        private readonly ProductDao _productDao;
        private readonly ProductImageDao _productImageDao;
        private readonly ProductReviewDao _productReviewDao;
        private readonly ProductVariantDao _productVariantDao;
        private readonly ProductTaxDao _productTaxDao;
        private readonly ProductCategoryGroupDao _productCategoryGroupDao;

        public ProductRepo(MinhXuanDatabaseContext context)
        {
            _productCategoryDao = new ProductCategoryDao(context);
            _productDao = new ProductDao(context);
            _productImageDao = new ProductImageDao(context);
            _productReviewDao = new ProductReviewDao(context);
            _productVariantDao = new ProductVariantDao(context);
            _productTaxDao = new ProductTaxDao(context);
            _productCategoryGroupDao = new ProductCategoryGroupDao(context);
        }

        #region Category

        public async Task<ProductCategory?> CreateCategoryAsync(ProductCategory category)
        {
            var existingCategory = await _productCategoryDao.GetByNameAsync(category.CategoryName);
            if (existingCategory != null)
            {
                throw new ArgumentException("Category with this name already exists.");
            }
            return await _productCategoryDao.CreateAsync(category);
        }

        public async Task<ProductCategory?> GetCategoryByIdAsync(int categoryId)
        {
            return await _productCategoryDao.GetByIdAsync(categoryId);
        }

        public async Task<ProductCategory?> UpdateCategoryAsync(ProductCategory category)
        {
            var existingCategory = await _productCategoryDao.GetByIdAsync(category.CategoryId);
            if (existingCategory == null)
            {
                throw new ArgumentException("Category not found.");
            }
            return await _productCategoryDao.UpdateAsync(category);
        }

        public async Task<List<ProductCategoryGroup>?> GetAllCategoriesAsync()
        {
            return await _productCategoryGroupDao.GetAllAsync() ?? new List<ProductCategoryGroup>();
        }

        #endregion Category

        #region Product

        public async Task<Product?> CreateProductAsync(Product product)
        {
            var existingProduct = await _productDao.GetByNameAsync(product.ProductName);
            if (existingProduct != null)
            {
                throw new ArgumentException("Product with this name already exists.");
            }
            return await _productDao.CreateAsync(product);
        }

        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await _productDao.GetByIdAsync(productId);
        }

        public async Task<Product?> UpdateProductAsync(Product product)
        {
            var existingProduct = await _productDao.GetByIdAsync(product.ProductId);
            if (existingProduct == null)
            {
                throw new ArgumentException("Product not found.");
            }
            product.UpdatedAt = DateTime.Now;
            return await _productDao.UpdateAsync(product);
        }

        public async Task<List<Product>?> GetAllProductsAsync()
        {
            return await _productDao.GetAllAsync();
        }

        public async Task<List<Product>?> GetProductPageAsync(int group,int category, int page, int pageSize)
        {
            return await _productDao.GetPageAsync(group,category,page,pageSize);
        }

        #endregion Product

        #region ProductImage

        public async Task<ProductImage?> CreateProductImageAsync(ProductImage productImage)
        {
            return await _productImageDao.CreateAsync(productImage);
        }

        public async Task<ProductImage?> GetProductImageByIdAsync(int productImageId)
        {
            return await _productImageDao.GetByIdAsync(productImageId);
        }

        public async Task<ProductImage?> UpdateProductImageAsync(ProductImage productImage)
        {
            var existingProductImage = await _productImageDao.GetByIdAsync(productImage.ProductImageId);
            if (existingProductImage == null)
            {
                throw new ArgumentException("Product image not found.");
            }

            productImage.UpdatedAt = DateTime.Now;
            return await _productImageDao.UpdateAsync(productImage);
        }

        public async Task<List<ProductImage>?> GetAllProductImagesAsync()
        {
            return await _productImageDao.GetAllAsync();
        }

        public async Task<bool> DeleteProductImageAsync(int productImageId)
        {
            var productImage = await _productImageDao.GetByIdAsync(productImageId);
            if (productImage != null)
            {
                await _productImageDao.DeleteAsync(productImageId);
                return true;
            }
            return false;
        }

        #endregion ProductImage

        #region ProductReview

        public async Task<ProductReview?> CreateProductReviewAsync(ProductReview productReview)
        {
            return await _productReviewDao.CreateAsync(productReview);
        }

        public async Task<ProductReview?> GetProductReviewByIdAsync(int productReviewId)
        {
            return await _productReviewDao.GetByIdAsync(productReviewId);
        }

        public async Task<ProductReview?> UpdateProductReviewAsync(ProductReview productReview)
        {
            var existingProductReview = await _productReviewDao.GetByIdAsync(productReview.ReviewId);
            if (existingProductReview == null)
            {
                throw new ArgumentException("Product review not found.");
            }
            return await _productReviewDao.UpdateAsync(productReview);
        }

        public async Task<bool> DeleteProductReviewAsync(int productReviewId)
        {
            var productReview = await _productReviewDao.GetByIdAsync(productReviewId);
            if (productReview != null)
            {
                await _productReviewDao.DeleteAsync(productReviewId);
                return true;
            }
            return false;
        }

        public async Task<List<ProductReview>?> GetProductReviewsAsync(int productId)
        {
            return await _productReviewDao.GetByProductIdAsync(productId);
        }

        public async Task<List<ProductReview>?> GetProductReviewsPageAsync(int productId, int page, int pageSize)
        {
            var reviews = await _productReviewDao.GetByProductIdAsync(productId);
            return reviews.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public async Task<int> CountProductByCategory(int group,int category)
        {
            return await _productDao.CountProductByCategory(group,category);
        }

        public async Task<ProductVariant?> CreateProductVariantAsync(ProductVariant productVariant)
        {
            return await _productVariantDao.CreateAsync(productVariant);
        }

        public async Task<List<ProductVariant>?> GetAllVariantsAsync(int productId)
        {
            return await _productVariantDao.GetByProductIdAsync(productId);
        }

        public async Task<ProductVariant?> GetProductVariantByIdAsync(int variantId)
        {
            return await _productVariantDao.GetByIdAsync(variantId);
        }

        public async Task<ProductVariant?> UpdateProductVariantAsync(ProductVariant productVariant)
        {
            var existingProductVariant = await _productVariantDao.GetByIdAsync(productVariant.VariantId);
            if (existingProductVariant == null)
            {
                throw new ArgumentException("Product variant not found.");
            }
            return await _productVariantDao.UpdateAsync(productVariant);
        }

        public async Task<ProductTaxis?> AddProductTaxAsync(ProductTaxis productTax)
        {
            var product = await _productDao.GetByIdAsync((int)productTax.ProductId);
            if(product.ProductTaxes.Any(t=>t.TaxId == productTax.TaxId && t.ProductId == productTax.ProductId))
            {
                return null;
            }
            return  await _productTaxDao.CreateAsync(productTax);
        }

        public async Task<ProductTaxis?> DeleteProductTaxAsync(int productTaxid)
        {
            return await _productTaxDao.DeleteAsync(productTaxid);
        }

        public async Task<List<Product>> FilterProductsAsync(List<int?> categories)
        {
            return await _productDao.GetProductByCategory(categories);
        }

        public async Task<ProductCategoryGroup?> CreateGroupCategoryAsync(ProductCategoryGroup group)
        {
            return await _productCategoryGroupDao.CreateAsync(group);
        }

        public async Task<ProductCategoryGroup> UpdateGroupCategoryAsync(ProductCategoryGroup group)
        {
            var groupExit = await _productCategoryGroupDao.GetByIdAsync(group.GroupId);
            if(groupExit == null) throw new ArgumentException("Product category group not found.");
            return await _productCategoryGroupDao.UpdateAsync(group);
        }

        public async Task<List<Product>> GetProductByIdsAsync(List<int> productIds)
        {
            var products = await _productDao.GetProductByIdsAsync(productIds);
            return products;
        }

        public async Task<List<ProductVariant>> GetProductVariantsByIdsAsync(List<int> Ids)
        {
            var products = await _productVariantDao.GetProductVariantByIdsAsync(Ids);
            return products;
        }

        #endregion ProductReview
    }
}
