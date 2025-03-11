using AutoMapper;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.Extensions.Logging;

namespace BusinessLogicLayer.Services;

public class TaxService :ITaxService
{
    private readonly ITaxRepo _taxRepo;
    private readonly IMapper _mapper;
    private readonly ILogger<TaxService> _logger;
    public TaxService(MinhXuanDatabaseContext context, IMapper mapper, ILogger<TaxService> logger)
    {
        _taxRepo = new TaxRepo(context);
        _mapper = mapper;
        _logger = logger;
    }
    
    public async Task<List<TaxResponse>?> GetAllTaxAsync()
    {
        try
        {
            var taxes = await _taxRepo.GetAllTaxesAsync();
            return _mapper.Map<List<TaxResponse>>(taxes);
        }catch(Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return null;
        }
    }
}