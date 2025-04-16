using DataAccessObject.Repository.Interface;
using BusinessObject.Entities;
using DataAccessObject.Dao;

namespace DataAccessObject.Repository
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly InvoiceDao _invoiceDao;

        public InvoiceRepository(MinhXuanDatabaseContext context)
        {
            _invoiceDao = new InvoiceDao(context);
        }

        public async Task<Invoice?> GetReceiptByIdAsync(int id)
        {
            return await _invoiceDao.GetByIdAsync(id);
        }

        public async Task<Invoice?> CreateReceiptAsync(Invoice receipt)
        {
            return await _invoiceDao.CreateAsync(receipt);
        }

        public async Task<Invoice?> UpdateInvoiceAsync(Invoice receipt)
        {
            return await _invoiceDao.UpdateAsync(receipt);
        }

        public async Task<bool> DeleteReceiptAsync(int id)
        {
            return await _invoiceDao.DeleteAsync(id);
        }

        public async Task<List<Invoice>?> GetAllInvoicesAsync()
        {
            return await _invoiceDao.GetAllAsync();
        }

        public async Task<List<Invoice>?> GetReceiptsPageAsync(int page, int pageSize)
        {
            return await _invoiceDao.GetPageAsync(page, pageSize);
        }

        public async Task<Invoice?> GetInvoiceByNumberAsync(string invoiceNumber)
        {
            return await _invoiceDao.GetInvoiceByNumberAsync(invoiceNumber);
        }
    }
}
