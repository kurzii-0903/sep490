using AutoMapper;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;

namespace BusinessLogicLayer.Services;

public class ReportService :IReportService
{
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IMapper _mapper;

    public ReportService( IProductRepository productRepository,IUserRepository userRepository,IOrderRepository orderRepository,IInvoiceRepository invoiceRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _userRepository =userRepository;
        _orderRepository = orderRepository;
        _mapper = mapper;
        _invoiceRepository =  invoiceRepository;
    }

    public async Task<Report> GetReport()
    {
        try
        {
            var currentYear = DateTime.Now.Year;
            var totalCustomer = await _userRepository.CountCustomers();
            var totalOrder = await _orderRepository.CountOrdersAsync();
            var totalProductSale = await _productRepository.CountProductSaleAsync();
            var productSales = await _productRepository.GetProductSaleQualityAsync(5);
            var invoices = await _invoiceRepository.GetAllInvoicesAsync()??new List<Invoice>();
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
                    Amount = invoices.Where(inv => inv.PaymentStatus == "Completed" && inv.CreatedAt.Month == i ).Sum(inv => inv.Amount) 
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