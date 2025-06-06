﻿using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BusinessLogicLayer.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;
    private readonly ILogger<InvoiceService> _logger;
    private readonly string _imagePathBill = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","customer","bills");
    public InvoiceService(IInvoiceRepository invoiceRepository, IFileService fileService, IMapper mapper, ILogger<InvoiceService> logger )
    {
        _invoiceRepository = invoiceRepository;
        _fileService = fileService;
        _mapper = mapper;
        _logger = logger;
        
    }
    public async Task<InvoiceResponse?> ConFirmInvoiceByCustomerAsync(ConfirmInvoice confirmInvoice)
    {
        try
        {
            var invoice = await _invoiceRepository.GetInvoiceByNumberAsync(confirmInvoice.InvoiceNumber);
            if(invoice == null) { return null; }
            var fileBill = confirmInvoice.File;
            if (fileBill != null)
            {
                var fileName = invoice.InvoiceNumber + ".jpg";
                if (!string.IsNullOrEmpty(fileName))
                {
                    invoice.FileName = await _fileService.SaveFileBillAsync(_imagePathBill,fileBill,fileName);
                    _logger.LogInformation(_imagePathBill);
                }
            }

            invoice.PaymentConfirmOfCustomer = true;
            invoice.PaymentDate = DateTime.Now;
            invoice = await _invoiceRepository.UpdateInvoiceAsync(invoice);
            if(invoice == null) { return null; }
            return _mapper.Map<InvoiceResponse>(invoice);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order.");
            throw;
        }
    }

    public async Task<InvoiceResponse?> ConFirmInvoiceByEmployeeAsync(string invoiceNo,string status)
    {
        try
        {
            var invoice = await _invoiceRepository.GetInvoiceByNumberAsync(invoiceNo);
            if(invoice == null) { return null; }

            invoice.PaymentConfirmOfCustomer = true;
            invoice.PaymentDate = DateTime.Now;
            invoice.PaymentStatus = status;
            invoice.Order.Status = status;
            invoice.Order.UpdatedAt = DateTime.Now;
            invoice = await _invoiceRepository.UpdateInvoiceAsync(invoice);
            if(invoice == null) { return null; }
            return _mapper.Map<InvoiceResponse>(invoice);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order.");
            throw;
        }
    }

    public async Task<FileStream?> GetImageFileByInvoiceNumberAsync(string invoiceNo)
    {
        try
        {
            var invoice = await _invoiceRepository.GetInvoiceByNumberAsync(invoiceNo);
            if (invoice == null) return null;
            if (!string.IsNullOrEmpty(invoice.FileName))
            {
                var filePath = $"{_imagePathBill}/{invoice.FileName}";
                return await _fileService.GetFileAsStreamAsync(filePath);
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting image.");
            throw;
        }
    }
}