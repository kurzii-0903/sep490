using BusinessLogicLayer.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace BusinessLogicLayer.Services;

public  class FileService : IFileService
{
    private readonly string _imageDirectory;
    private readonly ILogger<FileService> _logger;

    public FileService(ILogger<FileService> logger, string imageDirectory)
    {
        _logger = logger;
        _imageDirectory = imageDirectory;
    }

    public async Task<string?> SaveImageAsync(IFormFile file)
    {
        try
        {
            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }

            var fileName = $"{Guid.NewGuid()}.jpg"; 
            var filePath = Path.Combine(_imageDirectory, fileName);

            using (var image = Image.Load(file.OpenReadStream())) 
            {
                // Giảm kích thước ảnh (ví dụ: tối đa 1080px chiều rộng hoặc cao)
                int maxWidth = 1080;
                int maxHeight = 1080;
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(maxWidth, maxHeight)
                }));

                // Giảm chất lượng ảnh xuống 75% để tiết kiệm dung lượng
                var encoder = new JpegEncoder { Quality = 75 };

                await image.SaveAsync(filePath, encoder);
            }

            _logger.LogInformation($"Image saved to {_imageDirectory}");
            return fileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving image.");
            return null;
        }
    }
}