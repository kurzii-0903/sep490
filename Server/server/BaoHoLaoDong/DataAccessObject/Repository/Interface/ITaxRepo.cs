using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface;

public interface ITaxRepo
{
    public Task<List<Tax>?> GetAllTaxesAsync();
}