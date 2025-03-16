using DataAccessObject.Repository.Interface;
using BusinessObject.Entities;
using DataAccessObject.Dao;

namespace DataAccessObject.Repository
{
    public class InvoiceRepo : IInvoiceRepo
    {
        private readonly InvoiceDao _receiptDao;

        public InvoiceRepo(MinhXuanDatabaseContext context)
        {
            _receiptDao = new InvoiceDao(context);
        }

        public async Task<Invoice?> GetReceiptByIdAsync(int id)
        {
            return await _receiptDao.GetByIdAsync(id);
        }

        public async Task<Invoice?> CreateReceiptAsync(Invoice receipt)
        {
            return await _receiptDao.CreateAsync(receipt);
        }

        public async Task<Invoice?> UpdateReceiptAsync(Invoice receipt)
        {
            return await _receiptDao.UpdateAsync(receipt);
        }

        public async Task<bool> DeleteReceiptAsync(int id)
        {
            return await _receiptDao.DeleteAsync(id);
        }

        public async Task<List<Invoice>?> GetAllReceiptsAsync()
        {
            return await _receiptDao.GetAllAsync();
        }

        public async Task<List<Invoice>?> GetReceiptsPageAsync(int page, int pageSize)
        {
            return await _receiptDao.GetPageAsync(page, pageSize);
        }
    }
}
