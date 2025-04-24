using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Mappings.RequestDTO;
namespace BusinessLogicLayer.Validations;

public class UniqueProductVariantsAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is ICollection<NewProductVariant> variants)
        {
            var duplicateVariants = variants
                .GroupBy(v => new { v.Size, v.Color })
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicateVariants.Any())
            {
                return new ValidationResult("Không được có hai biến thể có cùng Size và Color.");
            }
        }

        return ValidationResult.Success;
    }
}