using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Validations
{
    public class MaxFileSizeAttribute : ValidationAttribute
    {
        private readonly int _maxFileSizeInBytes;

        public MaxFileSizeAttribute(int maxFileSizeInMb)
        {
            _maxFileSizeInBytes = maxFileSizeInMb * 1024 * 1024; 
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is List<IFormFile> files)
            {
                foreach (var file in files)
                {
                    if (file.Length > _maxFileSizeInBytes)
                    {
                        return new ValidationResult(GetErrorMessage(file.FileName));
                    }
                }
            }
            else if (value is IFormFile file)
            {
                if (file.Length > _maxFileSizeInBytes)
                {
                    return new ValidationResult(GetErrorMessage(file.FileName));
                }
            }
            return ValidationResult.Success;
        }

        private string GetErrorMessage(string fileName)
        {
            if (_maxFileSizeInBytes < 1024 * 1024)
            {
                return $"File {fileName} quá lớn, chỉ cho phép tối đa {_maxFileSizeInBytes / 1024}KB.";
            }
            return $"File {fileName} quá lớn, chỉ cho phép tối đa {_maxFileSizeInBytes / (1024 * 1024)}MB.";
        }
    }
}