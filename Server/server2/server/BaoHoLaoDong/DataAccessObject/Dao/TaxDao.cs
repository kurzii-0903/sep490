using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessObject.Dao
{
    public class TaxDao
    {
        private readonly MinhXuanDatabaseContext _context;

        public TaxDao(MinhXuanDatabaseContext context)
        {
            _context = context;
        }

        // Lấy tất cả thuế
        public async Task<List<Tax>> GetAllAsync()
        {
            return await _context.Taxes
                .AsNoTracking()
                .ToListAsync();
        }

        // Lấy thuế theo ID
        public async Task<Tax?> GetByIdAsync(int id)
        {
            return await _context.Taxes
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TaxId == id);
        }

        // Thêm thuế mới
        public async Task<Tax> CreateAsync(Tax tax)
        {
            _context.Taxes.Add(tax);
            await _context.SaveChangesAsync();
            return tax;
        }

        // Cập nhật thuế
        public async Task<Tax?> UpdateAsync(Tax tax)
        {
            var existingTax = await _context.Taxes.FindAsync(tax.TaxId);
            if (existingTax == null) return null;

            _context.Entry(existingTax).CurrentValues.SetValues(tax);
            await _context.SaveChangesAsync();
            return existingTax;
        }

        // Xóa thuế
        public async Task<bool> DeleteAsync(int id)
        {
            var tax = await _context.Taxes.FindAsync(id);
            if (tax == null) return false;

            _context.Taxes.Remove(tax);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}