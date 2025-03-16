using BusinessLogicLayer.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace BusinessLogicLayer.Services;

public class FileService : IFileService
{
    private readonly ILogger<FileService> _logger;
    private const int MAX_FILE_SIZE_KB = 300; // Giới hạn file tối đa 500KB

    public FileService(ILogger<FileService> logger)
    {
        _logger = logger;
    }

    public async Task<string?> SaveImageAsync(string imageDirectory,IFormFile file)
    {
        try
        {
            if (!Directory.Exists(imageDirectory))
            {
                Directory.CreateDirectory(imageDirectory);
            }

            var fileName = $"{Guid.NewGuid()}.webp"; 
            var filePath = Path.Combine(imageDirectory, fileName);

            using (var image = Image.Load(file.OpenReadStream())) 
            {
                // Giảm kích thước ảnh (tối đa 1080px chiều rộng hoặc cao)
                int maxWidth = 1080;
                int maxHeight = 1080;
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(maxWidth, maxHeight)
                }));

                int quality = 75; // Mặc định là 75%
                long fileSizeKB = file.Length / 1024; // Kích thước file ban đầu (KB)

                // Nếu file lớn hơn mức tối đa, giảm chất lượng xuống 50%
                if (fileSizeKB > MAX_FILE_SIZE_KB)
                {
                    quality = 50;
                }

                var encoder = new WebpEncoder { Quality = quality };

                await image.SaveAsync(filePath, encoder);
            }

            _logger.LogInformation($"Image saved as WebP to {imageDirectory}");
            return fileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving WebP image.");
            return null;
        }
    }

    public async Task<bool> DeleteFileAsync(string directoryFile)
    {
        return await Task.Run(() =>
        {
            try
            {
                if (File.Exists(directoryFile))
                {
                    File.Delete(directoryFile);
                    return true;
                }
                return false; 
            }
            catch (Exception)
            {
                return false; 
            }
        });
    }

    public async Task<string?> SaveFileBillAsync(string imageDirectory, IFormFile file, string fileName)
    {
        try
        {
            var filePath = Path.Combine(imageDirectory, fileName);
            using (var image = Image.Load(file.OpenReadStream())) 
            {
                // Giảm kích thước ảnh (tối đa 1080px chiều rộng hoặc cao)
                int maxWidth = 1080;
                int maxHeight = 1080;
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(maxWidth, maxHeight)
                }));

                int quality = 75; // Mặc định là 75%
                long fileSizeKB = file.Length / 1024; // Kích thước file ban đầu (KB)

                // Nếu file lớn hơn mức tối đa, giảm chất lượng xuống 50%
                if (fileSizeKB > MAX_FILE_SIZE_KB)
                {
                    quality = 50;
                }

                var encoder = new WebpEncoder { Quality = quality };

                await image.SaveAsync(filePath, encoder);
            }

            _logger.LogInformation($"Image saved as WebP to {imageDirectory}");
            return fileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving WebP image.");
            return null;
        }
    }
}
