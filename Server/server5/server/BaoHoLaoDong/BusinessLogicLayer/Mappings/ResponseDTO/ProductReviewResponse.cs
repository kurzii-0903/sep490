﻿namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductReviewResponse
{
    public int ReviewId { get; set; }

    public int ProductId { get; set; }

    public int CustomerId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerImage { get; set; } = string.Empty;
}