using AutoMapper;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;

namespace BusinessLogicLayer.Services;

public class ReportService :IReportService
{
    private readonly IProductRepo _productRepo;
    private readonly IUserRepo _userRepo;
    private readonly IOrderRepo _orderRepo;
    private readonly IInvoiceRepo _invoiceRepo;
    private readonly IMapper _mapper;

    public ReportService(MinhXuanDatabaseContext context, IMapper mapper)
    {
        _productRepo = new ProductRepo(context);
        _userRepo = new UserRepo(context);
        _orderRepo = new OrderRepo(context);
        _mapper = mapper;
        _invoiceRepo = new InvoiceRepo(context);
    }

    public async Task<Report> GetReport()
    {
        try
        {
            var currentYear = DateTime.Now.Year;
            var totalCustomer = await _userRepo.CountCustomers();
            var totalOrder = await _orderRepo.CountOrdersAsync();
            var totalProductSale = await _productRepo.CountProductSaleAsync();
            var productSales = await _productRepo.GetProductSaleQualityAsync(5);
            var invoices = await _invoiceRepo.GetAllReceiptsAsync()??new List<Invoice>();
            invoices = invoices.Where(i => i.CreatedAt.Year == currentYear ).ToList();
            var mappedProductSale = productSales.Select(ps => new ProductSaleResponse
            {
                Product = _mapper.Map<ProductResponse>(ps.Key),
                Quantity = ps.Value
            }).ToList();
           
            var revenues = new List<Revenue>();
            for (int i = 1; i <= 12; i++)
            {
                revenues.Add(new Revenue()
                {
                    Month = i,
                    Year = currentYear,
                    Amount = invoices.Where(inv => inv.Status == "Paid" && inv.CreatedAt.Month == i ).Sum(inv => inv.Amount) 
                });
            }
            var report = new Report()
            {
                TotalCustomer = totalCustomer,
                TotalOrder = totalOrder,
                TotalProductSale = totalProductSale ?? 0,
                TopSaleproduct = mappedProductSale,
                Revenues = revenues.OrderBy(t=>t.Month).ToList(),
            };

            return report;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

}