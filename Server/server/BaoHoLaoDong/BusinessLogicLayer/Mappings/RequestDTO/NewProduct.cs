using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO
{
    public class NewProduct
    {
        [Required(ErrorMessage = "Tên không được để trống")]
        //[NoSpecialCharacters(ErrorMessage = "Tên sản phẩm không được chứa các ký tự đặc biệt và khoảng trắng trước")]
        public string Name { get; set; } = null!;
        [Required(ErrorMessage = "Loại sản phẩm không được để trống")]
        public int Category { get; set; }
        public string? Description { get; set; }
        [NoSpecialCharacters(ErrorMessage = "Chất liệu không được chứa khoảng trắng trước và các ký tự đặc biệt")]
        public string? Material { get; set; }
        [NoSpecialCharacters(ErrorMessage = "Xuất xứ không được chứa khoảng trắng trước và các ký tự đặc biệt")]
        public string? Origin { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a positive number more than {0}.")]
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive number more than {0}.")]
        public decimal Price { get; set; }
        [Range(0,100,ErrorMessage = "Chiết khấu chỉ trong khoảng 0-100%")]
        public decimal? Discount { get; set; }
        
        public string? QualityCertificate { get; set; }

        public bool Status { get; set; }
        
        [MinFileCount(1,ErrorMessage = "Phải tải lên ít nhất 1 hình ảnh")]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif" })]
        [MaxFileSize(3)]
        public List<IFormFile> Files { get; set; } = null!;
        public ICollection<NewProductVariant> ProductVariants { get; set; } = new List<NewProductVariant>();
    }
}