using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Validations;

public class MaxFileSizeAttribute : ValidationAttribute
{
    private readonly int _maxFileSizeInMB;

    public MaxFileSizeAttribute(int maxFileSizeInMB)
    {
        _maxFileSizeInMB = maxFileSizeInMB;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is List<IFormFile> files)
        {
            foreach (var file in files)
            {
                if (file.Length > _maxFileSizeInMB * 1024 * 1024)
                {
                    return new ValidationResult($"File {file.FileName} quá lớn, chỉ cho phép tối đa {_maxFileSizeInMB}MB.");
                }
            }
        }
        else if (value is IFormFile file)
        {
            if (file.Length > _maxFileSizeInMB * 1024 * 1024)
            {
                return new ValidationResult($"File {file.FileName} quá lớn, chỉ cho phép tối đa {_maxFileSizeInMB}MB.");
            }
        }
        return ValidationResult.Success;
    }
}