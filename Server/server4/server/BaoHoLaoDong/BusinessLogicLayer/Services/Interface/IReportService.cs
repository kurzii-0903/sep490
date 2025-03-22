using BusinessLogicLayer.Mappings.ResponseDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface IReportService
{
    Task<Report> GetReport();
}