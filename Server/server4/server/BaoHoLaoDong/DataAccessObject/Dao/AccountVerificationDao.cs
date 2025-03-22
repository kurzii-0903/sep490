using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObject.Dao;

public class AccountVerificationDao : IDao<AccountVerification>
{
    private readonly MinhXuanDatabaseContext _context;
    public AccountVerificationDao(MinhXuanDatabaseContext context)
    {
        _context = context;
    }

    public async Task<AccountVerification?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<AccountVerification?> CreateAsync(AccountVerification entity)
    {
        await _context.AccountVerifications.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<AccountVerification?> UpdateAsync(AccountVerification entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<AccountVerification>?> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<List<AccountVerification>?> GetPageAsync(int page, int pageSize)
    {
        throw new NotImplementedException();
    }

    public async Task<AccountVerification?> GetByAccountIdAsync(int accountId)
    {
        return await _context.AccountVerifications
            .Where(x => x.AccountId == accountId )
            .FirstOrDefaultAsync();
    }
}