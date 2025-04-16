using BusinessObject.Entities;

namespace DataAccessObject.Repository.Interface;

public interface IUserRepository
{
    // customer methods
    Task<Customer?> GetCustomerByIdAsync(int id);
    Task<Customer?> GetCustomerByEmailAsync(string email);
    Task<Customer?> GetCustomerByPhoneAsync(string phone);
    Task<Customer?> CreateCustomerAsync(Customer customer);
    Task<Customer?> UpdateCustomerAsync(Customer customer);
    Task<List<Customer>?> GetCustomersPageAsync(int page, int pageSize);
    Task<List<Customer>?> GetAllCustomersAsync();
    Task<AccountVerification?> CreateNewVefificationCodeAsync(int accountId);
    // employee methods
    Task<Employee?> GetEmployeeByIdAsync(int id);
    Task<Employee?> GetEmployeeByEmailAsync(string email);
    Task<Employee?> GetEmployeeByPhoneAsync(string phone);
    Task<Employee?> CreateEmployeeAsync(Employee employee);
    Task<Employee?> UpdateEmployeeAsync(Employee employee);
    Task<List<Employee>?> GetEmployeesPageAsync(int page, int pageSize);
    Task<List<Employee>?> GetAllEmployeesAsync();
    Task<AccountVerification?> GetAccountVerificationByIdAndTypeAccountAsync(int id);
    Task<int> CountCustomers();
    Task<int> CountEmployees();
    Task<AccountVerification?> ConfirmEmailCustomerSuccessAsync(int customerCustomerId);
}