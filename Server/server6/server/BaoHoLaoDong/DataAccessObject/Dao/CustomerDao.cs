using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao
{
    public class CustomerDao : IDao<Customer>
    {
        private readonly MinhXuanDatabaseContext _context;

        public CustomerDao(MinhXuanDatabaseContext context)
        {
            _context = context;
        }

        // Get customer by Id
        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CustomerId == id);
        }

        // Create a new customer
        public async Task<Customer?> CreateAsync(Customer entity)
        {
            await _context.Customers.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Update an existing customer
        public async Task<Customer?> UpdateAsync(Customer entity)
        {
            var existingCustomer = await GetByIdAsync(entity.CustomerId);
            if (existingCustomer == null)
            {
                throw new ArgumentException("Customer not found");
            }

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }

        // Delete a customer by Id
        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return false;
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get all customers
        public async Task<List<Customer>?> GetAllAsync()
        {
            return await _context.Customers
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Customer>?> GetPageAsync(int page, int pageSize)
        {
            return await _context.Customers
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _context.Customers
                .AsNoTracking() // Ensure we don't track the entity for read-only operations
                .FirstOrDefaultAsync(c => c.Email == email); // Find customer by email
        }
        public async Task<Customer?> GetByPhoneAsync(string phone)
        {
            return await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.PhoneNumber == phone); // Find customer by phone number
        }

        public async Task<int> CountAsync()
        {
            return await _context.Customers.CountAsync();
        }
    }
}
