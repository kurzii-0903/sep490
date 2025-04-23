using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    public class NewProduct
    {
        [Required(ErrorMessage = "Tên không được để trống")]
        [UniqueProductName]
        [NoSpecialCharacters]
        public string Name { get; set; } = null!;
        [Required]
        public int Category { get; set; }
        
        public string? Description { get; set; }
        [NoSpecialCharacters]
        public string? Material { get; set; }
        [NoSpecialCharacters]
        public string? Origin { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a positive number more than {0}.")]
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive number more than {0}.")]
        public decimal Price { get; set; }
        [Range(0,100,ErrorMessage = "Chiết khấu chỉ trong khoảng 0-100%")]
        public decimal? Discount { get; set; }
        public string? QualityCertificate { get; set; }
        
        public bool FreeShip { get; set; }
        
        [Range(0,int.MaxValue, ErrorMessage = "Guarantee must >= 0")]
        public int Guarantee { get; set; }
        public bool Status { get; set; }
        
        [MinFileCount(1,ErrorMessage = "Phải tải lên ít nhất 1 hình ảnh")]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".svg" })]
        [MaxFileSize(5)]
        public List<IFormFile> Files { get; set; } = null!;
        [UniqueProductVariants]
        public ICollection<NewProductVariant> ProductVariants { get; set; } = new List<NewProductVariant>();
    }
}