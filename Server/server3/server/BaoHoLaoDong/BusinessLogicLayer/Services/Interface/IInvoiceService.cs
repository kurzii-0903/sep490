using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;

namespace BusinessLogicLayer.Services.Interface;

public interface IInvoiceService
{
    Task<InvoiceResponse?> ConFirmInvoiceByCustomerAsync(ConfirmInvoice confirmInvoice);
    Task<InvoiceResponse?> ConFirmInvoiceByEmployeeAsync(string invoiceNo,string status);
}