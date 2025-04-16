using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface ITaxService
{
     Task<List<TaxResponse>?> GetAllTaxAsync();
     Task<TaxResponse?> CreateTaxAsync(NewTax tax);
     Task<TaxResponse?> UpdateTaxAsync(UpdateTax tax);
}