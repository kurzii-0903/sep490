using BusinessLogicLayer.Mappings.ResponseDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface ITaxService
{
     Task<List<TaxResponse>?> GetAllTaxAsync();
}