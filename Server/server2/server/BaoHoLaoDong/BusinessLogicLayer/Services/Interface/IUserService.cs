using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;

namespace BusinessLogicLayer.Services.Interface;

public interface IUserService
{
    //Employee
    /// <summary>
    /// Login by email and password
    /// </summary>
    /// <param name="formLogin"></param>
    /// <returns></returns>
    Task<UserResponse?> UserLoginByEmailAndPasswordAsync(FormLogin formLogin);
    Task<UserResponse?> CreateNewEmployeeAsync(NewEmployee newEmployee);
    Task<Page<UserResponse>?> GetEmployeeByPageAsync(int page, int pageSize);
    Task<UserResponse?> GetUserByEmailAsync(string email);
    Task<UserResponse?> GetEmployeeByIdAsync(int employeeId);
    Task<UserResponse?> UpdateEmployeeAsync(UpdateEmployee updateEmployee);
    
    //Customer
    /// <summary>
    /// Create new customer and send email verification code 
    /// </summary>
    /// <param name="newCustomer"></param>
    /// <returns></returns>
    Task<UserResponse?> CreateNewCustomerAsync(NewCustomer newCustomer);
    Task<UserResponse?> CustomerLoginByEmailAndPasswordAsync(FormLogin formLogin);
    Task<Page<UserResponse>?> GetCustomerByPageAsync(int page, int pageSize);
    Task<UserResponse?> GetCustomerByEmailAsync(string email);
    Task<UserResponse?> UpdateCustomerAsync(UpdateCustomer updateCustomer);
    Task<bool> SendVerificationCodeBackAsync(string email);
    Task<UserResponse?> ConfirmEmailCustomerAsync(string email, string code);
    Task<Page<UserResponse>?> GetAllUserPageAsync(string role,int page, int size);
    Task<bool> ResetPasswordAsync(ResetPassword resetPassword);
}