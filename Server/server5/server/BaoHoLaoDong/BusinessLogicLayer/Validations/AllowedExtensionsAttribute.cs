using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Validations;

public class AllowedExtensionsAttribute : ValidationAttribute
{
    private readonly string[] _extensions;
    
    public AllowedExtensionsAttribute(string[] extensions)
    {
        _extensions = extensions;
    }
    // check image 
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is List<IFormFile> files)
        {
            foreach (var file in files)
            {
                var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
                if (!_extensions.Contains(extension))
                {
                    return new ValidationResult($"File {file.FileName} có định dạng không hợp lệ. Chỉ chấp nhận {string.Join(", ", _extensions)}.");
                }
                if (!file.ContentType.StartsWith("image/"))
                {
                    return new ValidationResult($"File {file.FileName} không phải là hình ảnh hợp lệ.");
                }
            }
        }
        else if (value is IFormFile file)
        {
            var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            if (!_extensions.Contains(extension))
            {
                return new ValidationResult($"File {file.FileName} có định dạng không hợp lệ. Chỉ chấp nhận {string.Join(", ", _extensions)}.");
            }
            if (!file.ContentType.StartsWith("image/"))
            {
                return new ValidationResult($"File {file.FileName} không phải là hình ảnh hợp lệ.");
            }
        }
        return ValidationResult.Success;
    }
    
}