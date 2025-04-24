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
                if (!IsValidFile(file))
                {
                    return new ValidationResult($"File {file.FileName} có định dạng hoặc nội dung không hợp lệ.");
                }
            }
        }
        else if (value is IFormFile file)
        {
            if (!IsValidFile(file))
            {
                return new ValidationResult($"File {file.FileName} có định dạng hoặc nội dung không hợp lệ.");
            }
        }
        return ValidationResult.Success;
    }

    private bool IsValidFile(IFormFile file)
    {
        var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
        if (!_extensions.Contains(extension))
        {
            return false;
        }
        if (!file.ContentType.StartsWith("image/"))
        {
            return false;
        }
        return true;
    }
    
}