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
}