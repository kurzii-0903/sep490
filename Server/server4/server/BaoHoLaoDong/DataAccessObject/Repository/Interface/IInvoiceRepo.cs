using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface
{
    public interface IInvoiceRepo
    {
        Task<Invoice?> GetReceiptByIdAsync(int id);
        Task<Invoice?> CreateReceiptAsync(Invoice receipt);
        Task<Invoice?> UpdateInvoiceAsync(Invoice receipt);
        Task<bool> DeleteReceiptAsync(int id);
        Task<List<Invoice>?> GetAllInvoicesAsync();
        Task<List<Invoice>?> GetReceiptsPageAsync(int page, int pageSize);
        Task<Invoice?> GetInvoiceByNumberAsync(string invoiceNumber);
    }
}
