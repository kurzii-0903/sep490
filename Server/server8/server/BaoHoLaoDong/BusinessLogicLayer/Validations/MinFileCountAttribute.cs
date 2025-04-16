using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Validations;

public class MinFileCountAttribute : ValidationAttribute
{
    private readonly int _minCount;

    public MinFileCountAttribute(int minCount)
    {
        _minCount = minCount;
        ErrorMessage = $"Phải có ít nhất {_minCount} tệp tin.";
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is List<IFormFile> files)
        {
            if (files.Count < _minCount)
            {
                return new ValidationResult(ErrorMessage);
            }
        }
        else
        {
            return new ValidationResult("Danh sách tệp không hợp lệ.");
        }
        return ValidationResult.Success;
    }
}