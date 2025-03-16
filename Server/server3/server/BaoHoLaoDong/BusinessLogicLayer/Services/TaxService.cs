using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
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

    public async Task<TaxResponse?> CreateTaxAsync(NewTax tax)
    {
        try
        {
            var newTax = _mapper.Map<Tax>(tax);
            newTax = await _taxRepo.CreateAsync(newTax);
            return _mapper.Map<TaxResponse>(newTax);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return null;
        }
    }

    public async Task<TaxResponse?> UpdateTaxAsync(UpdateTax updateTax)
    {
        try
        {
            var tax = _mapper.Map<Tax>(updateTax);
            tax = await _taxRepo.UpdateAsync(tax);
            return _mapper.Map<TaxResponse>(tax);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return null;
        }
    }
}