using BusinessObject.Entities;

namespace BusinessLogicLayer.Mappings.ResponseDTO;

public class ProductDetailPage
{
    public ProductResponse Product { get; set; } = new ProductResponse();

    public List<ProductResponse> TopSaleProducts { get; set; } = new List<ProductResponse>();
    
    public Review Review { get; set; } = new Review();
    
    public List<ProductResponse> RelatedProducts { get; set; } = new List<ProductResponse>();
    public BlogPostResponse BlogTransport { get; set; } = new BlogPostResponse();
}