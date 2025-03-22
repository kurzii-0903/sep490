using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace BusinessLogicLayer.Validations;

public class NoSpecialCharactersAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return new ValidationResult("không được để trống hoặc chỉ chứa khoảng trắng.");
            }
        }

        return ValidationResult.Success;
    }
}