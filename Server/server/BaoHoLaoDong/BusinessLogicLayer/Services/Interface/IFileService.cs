using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services.Interface;

public interface IFileService
{
     Task<string?> SaveImageAsync(IFormFile file);
}