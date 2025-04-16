using System.ComponentModel.DataAnnotations;
namespace BusinessLogicLayer.Mappings.RequestDTO;

public class NewFeedBack
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    [Required]
    [Range(1,5 ,ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
    [MaxLength(100)]
    public string Comment { get; set; }
    [Required]
    public int ProductId { get; set; }
}