namespace DataAccessObject.Dao;

public interface IDao<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<T?> CreateAsync(T entity);
    Task<T?> UpdateAsync(T entity);
    Task<bool> DeleteAsync(int id);
    Task<List<T>?> GetAllAsync();
    Task<List<T>?> GetPageAsync(int page, int pageSize);
}