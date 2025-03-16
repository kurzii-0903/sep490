using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services.Interface;

public interface IFileService
{
     Task<string?> SaveImageAsync(string imageDirectory,IFormFile file);
     Task<bool> DeleteFileAsync(string directoryFile);
     Task<string?> SaveFileBillAsync(string imageDirectory,IFormFile file,string fileName);
}