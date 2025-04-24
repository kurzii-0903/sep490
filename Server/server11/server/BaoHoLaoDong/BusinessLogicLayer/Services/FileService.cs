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
    private const int MaxFileSizeKb = 300;

    public FileService(ILogger<FileService> logger)
    {
        _logger = logger;
    }

    public async Task<string?> SaveImageAsync(string imageDirectory, IFormFile file)
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

                long fileSizeKB = file.Length / 1024; // Kích thước file gốc (KB)
                int quality = 75; // Mặc định là 75%

                if (fileSizeKB > MaxFileSizeKb)
                {
                    // Tính toán tỷ lệ cần giảm
                    double scaleFactor = (double)MaxFileSizeKb / fileSizeKB;
                    quality = (int)(quality * scaleFactor); // Giảm chất lượng theo tỷ lệ

                    // Đảm bảo chất lượng không nhỏ hơn 10%
                    quality = Math.Max(quality, 10);
                }

                var encoder = new WebpEncoder { Quality = quality };

                await image.SaveAsync(filePath, encoder);
            }

            _logger.LogInformation($"Image saved as WebP to {filePath}");
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

                long fileSizeKB = file.Length / 1024;
                int quality = 75;

                if (fileSizeKB > MaxFileSizeKb)
                {
                    double scaleFactor = (double)MaxFileSizeKb / fileSizeKB;
                    quality = (int)(quality * scaleFactor);
                    quality = Math.Max(quality, 10);
                }

                var encoder = new WebpEncoder { Quality = quality };

                await image.SaveAsync(filePath, encoder);
            }

            _logger.LogInformation($"Image saved as WebP to {filePath}");
            return fileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving WebP image.");
            return null;
        }
    }

   public async Task<FileStream?> GetFileAsStreamAsync(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                return new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error reading file: {filePath}");
            return null;
        }
    }

}
