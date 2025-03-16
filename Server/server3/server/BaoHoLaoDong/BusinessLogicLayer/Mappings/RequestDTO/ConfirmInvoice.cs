using System.ComponentModel.DataAnnotations;
using BusinessLogicLayer.Validations;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Mappings.RequestDTO;

public class ConfirmInvoice
{
    [Required]
    public string InvoiceNumber { get; set; }
    
    public string Status { get; set; } = "Completed";
    
    public IFormFile? File { get; set; } = null;
    
}