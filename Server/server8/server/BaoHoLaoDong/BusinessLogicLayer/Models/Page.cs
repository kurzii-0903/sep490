namespace BusinessLogicLayer.Models;

public class Page<T>
{
    /// <summary>
    /// Dữ liệu của trang hiện tại.
    /// </summary>
    public List<T> Items { get; set; } = new List<T>();

    /// <summary>
    /// Trang hiện tại (bắt đầu từ 1).
    /// </summary>
    public int CurrentPage { get; set; }

    /// <summary>
    /// Số lượng mục trên mỗi trang.
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Tổng số mục trong toàn bộ danh sách.
    /// </summary>
    public int TotalItems { get; set; }

    /// <summary>
    /// Trang kế tiếp (nếu có), nếu không có thì bằng 0.
    /// </summary>
    public int NextPage { get; set; }
    
    /// <summary>
    /// Tổng số trang.
    /// </summary>
    public int TotalPages { get; set; }
    
    /// <summary>
    /// Constructor không tham số.
    /// </summary>
    public Page() { }

    /// <summary>
    /// Constructor với tham số khởi tạo.
    /// </summary>
    /// <param name="items">Danh sách mục của trang hiện tại.</param>
    /// <param name="currentPage">Trang hiện tại.</param>
    /// <param name="pageSize">Số lượng mục trên mỗi trang.</param>
    /// <param name="totalItems">Tổng số mục.</param>
    public Page(List<T>? items, int currentPage, int pageSize, int totalItems)
    {
        Items = items ?? new List<T>();
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalItems = totalItems;
        TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        NextPage = (currentPage * pageSize >= totalItems) ? 0 : currentPage + 1;
    }
}