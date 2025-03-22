using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class Review
{
    private int totalStar=0;
    public int TotalStar
    {
        get
        {
            return Star1+Star2+Star3+Star4+Star5;
        }
    }

    public int Star1 { get; set; } 
    public int Star2 { get; set; }
    public int Star3 { get; set; }
    public int Star4 { get; set; }
    public int Star5 { get; set; }
    public List<ProductReviewResponse>? ProductReviews { get; set; } = new List<ProductReviewResponse>();
}