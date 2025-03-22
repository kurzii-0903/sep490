using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Services.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogicLayer.Validations;

public class UniqueProductNameAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success;
        }

        var productService = validationContext.GetService<IProductService>();
        if (productService == null)
        {
            throw new ArgumentNullException(nameof(productService), "Product service is not available.");
        }

        string productName = value.ToString()!.Trim();
        bool exists = productService.IsProductNameExists(productName);
        return exists ? new ValidationResult("Tên sản phẩm đã tồn tại.") : ValidationResult.Success;
    }
}