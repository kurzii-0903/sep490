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
            if (name.StartsWith(" ") || name.EndsWith(" "))
            {
                return new ValidationResult("không được chứa khoảng trắng ở đầu hoặc cuối.");
            }
            if (!Regex.IsMatch(name, @"^[a-zA-Z0-9\s]+$"))
            {
                return new ValidationResult("chỉ được chứa chữ cái, số và khoảng trắng giữa các từ.");
            }
        }

        return ValidationResult.Success;
    }
}