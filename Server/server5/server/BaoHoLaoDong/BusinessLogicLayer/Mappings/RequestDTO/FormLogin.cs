using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class FormLogin
{
    [Required(ErrorMessage = "Email không được để trống.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Mật khẩu không được để trống.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}