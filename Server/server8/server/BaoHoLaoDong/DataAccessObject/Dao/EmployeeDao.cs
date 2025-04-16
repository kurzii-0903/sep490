using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class EmployeeDao : IDao<Employee>
{
    private readonly MinhXuanDatabaseContext _context;
    public EmployeeDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    public async Task<Employee?> GetByIdAsync(int id)
    {
        return await _context.Employees
            .Include(e=>e.Role)
            .FirstOrDefaultAsync(e=>e.EmployeeId == id);
    }

    public async Task<Employee?> CreateAsync(Employee entity)
    {
        await _context.Employees.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<Employee?> UpdateAsync(Employee entity)
    {
        entity.UpdateAt = DateTime.Now;
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return false;
        }

        _context.Employees.Remove(employee);

        await _context.SaveChangesAsync();

        return true; 
    }


    public async Task<List<Employee>?> GetAllAsync()
    {
        return await _context.Employees
            .Include(e=>e.Role)
            .ToListAsync();
    }

    public async Task<List<Employee>?> GetPageAsync(int page, int pageSize)
    {
        return await _context.Employees
            .Include(e=>e.Role)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<Employee?> GetEmployeeByEmailAsync(string email)
    {
        return await _context.Employees
            .Include(e=>e.Role)
            .FirstOrDefaultAsync(e => e.Email == email);
    }
    public async Task<Employee?> GetEmployeeByPhoneAsync(string phone)
    {
        return await _context.Employees
            .Include(e=>e.Role)
            .FirstOrDefaultAsync(e => e.PhoneNumber == phone); 
    }

    public async Task<int> CountAsync()
    {
        return await _context.Employees.CountAsync();
    }
}