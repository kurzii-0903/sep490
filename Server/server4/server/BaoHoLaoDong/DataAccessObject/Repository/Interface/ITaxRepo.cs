using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface;

public interface ITaxRepo
{
    public Task<List<Tax>?> GetAllTaxesAsync();
    Task<Tax> CreateAsync(Tax newTax);
    Task<Tax?> UpdateAsync(Tax updateTax);
}