using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services.Interface;

public interface IInvoiceService
{
    Task<InvoiceResponse?> ConFirmInvoiceByCustomerAsync(ConfirmInvoice confirmInvoice);
    Task<InvoiceResponse?> ConFirmInvoiceByEmployeeAsync(string invoiceNo,string status);
    Task<FileStream?> GetImageFileByInvoiceNumberAsync(string invoiceNo);
}