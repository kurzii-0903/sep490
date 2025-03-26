using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;

namespace DataAccessObject.Repository;

public class TaxRepo : ITaxRepo
{
    private readonly TaxDao _taxDao;
    public TaxRepo(MinhXuanDatabaseContext context)
    {
        _taxDao = new TaxDao(context);
    }
    public async Task<List<Tax>?> GetAllTaxesAsync()
    {
        return await _taxDao.GetAllAsync();
    }

    public async Task<Tax> CreateAsync(Tax newTax)
    {
        return await _taxDao.CreateAsync(newTax);
    }

    public async Task<Tax?> UpdateAsync(Tax updateTax)
    {
        return await _taxDao.UpdateAsync(updateTax);
    }
}