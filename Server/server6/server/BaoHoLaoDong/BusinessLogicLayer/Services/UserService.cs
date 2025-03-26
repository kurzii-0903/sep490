using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using BCrypt.Net;
using BusinessLogicLayer.Models;
using Microsoft.Extensions.Configuration; // Thư viện để mã hóa mật khẩu
using Microsoft.Extensions.Logging; // Thư viện log

namespace BusinessLogicLayer.Services;

public class UserService : IUserService
{
    private readonly IUserRepo _userRepo;
    private readonly IMailService _mailService;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService> _logger;
    // Inject ILogger vào constructor
    public UserService(IUserRepo userRepo, IMapper mapper, ILogger<UserService> logger,IMailService mailService )
    {
        _userRepo =userRepo;
        _mapper = mapper;
        _logger = logger;
        _mailService = mailService;
    }

    public async Task<UserResponse?> UserLoginByEmailAndPasswordAsync(FormLogin formLogin)
    {
        _logger.LogInformation("Starting login process for email: {Email}", formLogin.Email);

        var email = formLogin.Email;
        var password = formLogin.Password;

        try
        {
            var employee = await _userRepo.GetEmployeeByEmailAsync(email);
            var customer = await _userRepo.GetCustomerByEmailAsync(email);

            if (employee == null && customer == null)
            {
                _logger.LogWarning("Login failed for email {Email}: User not found", email);
                return null;
            }

            if (employee != null)
            {
                if (employee.Status != "Active")
                {
                    _logger.LogWarning("Login failed for email {Email}: Employee is not active", email);
                    return null;
                }

                if (BCrypt.Net.BCrypt.Verify(password, employee.PasswordHash))
                {
                    _logger.LogInformation("Login successful for email {Email} as Employee", email);
                    return _mapper.Map<UserResponse>(employee);
                }
            }

            if (customer != null)
            {
                if (customer.IsEmailVerified ==false)
                {
                    _logger.LogWarning("Login failed for email {Email}: Customer is not verify", email);
                    return null;
                }

                if (BCrypt.Net.BCrypt.Verify(password, customer.PasswordHash))
                {
                    _logger.LogInformation("Login successful for email {Email} as Customer", email);
                    return _mapper.Map<UserResponse>(customer);
                }
            }

            _logger.LogWarning("Login failed for email {Email}: Incorrect password", email);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during login process for email {Email}", email);
            throw;
        }
    }


    public async Task<UserResponse?> CreateNewEmployeeAsync(NewEmployee newEmployee)
    {
        _logger.LogInformation("Starting employee creation for email: {Email}", newEmployee.Email);
        try
        {
            var employee = _mapper.Map<Employee>(newEmployee);
            var result = await _userRepo.CreateEmployeeAsync(employee);
            if (result == null)
            {
                _logger.LogWarning("Failed to create employee for email {Email}", newEmployee.Email);
                return null;
            }
            _logger.LogInformation("Employee created successfully for email {Email}", newEmployee.Email);
            var empRequest = _mapper.Map<UserResponse>(result);
            return empRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during employee creation for email {Email}", newEmployee.Email);
            throw;
        }
    }

    public async Task<Page<UserResponse>?> GetEmployeeByPageAsync(int page, int pageSize)
    {
        try
        {
            var emps = await _userRepo.GetEmployeesPageAsync(page, pageSize);
            var totalEmp = await _userRepo.CountEmployees();
            var empRequests = _mapper.Map<List<UserResponse>>(emps);
            var pageResult = new Page<UserResponse>(empRequests, page, pageSize, totalEmp);
            _logger.LogInformation("Get employee by page successfully");
            return pageResult;
        }catch(Exception ex)
        {
            _logger.LogError(ex, "An error occurred during get employee by page");
            throw new Exception("An error occurred during get employee by page");
        }
    }

    public async Task<UserResponse?> GetUserByEmailAsync(string email)
    {
        var emp = await _userRepo.GetEmployeeByEmailAsync(email);
        if (emp == null)
        {
            var cus = await _userRepo.GetCustomerByEmailAsync(email);
            if (cus == null) return null;
            var cusRequest = _mapper.Map<UserResponse>(cus);
            return cusRequest;
        }
        var empRequest = _mapper.Map<UserResponse>(emp);
        return empRequest;
    }

    public async Task<UserResponse?> GetEmployeeByIdAsync(int employeeId)
    {
        var emp = await _userRepo.GetEmployeeByIdAsync(employeeId);
        var empRequest = _mapper.Map<UserResponse>(emp);
        return empRequest;
    }

    public async Task<UserResponse?> UpdateEmployeeAsync(UpdateEmployee updateEmployee)
    {
        try
        {
            var existingEmployee = await _userRepo.GetEmployeeByIdAsync(updateEmployee.Id);
            _mapper.Map(updateEmployee, existingEmployee);
            var updatedEmployee = await _userRepo.UpdateEmployeeAsync(existingEmployee);
            var employeeResponse = _mapper.Map<UserResponse>(updatedEmployee);
            return employeeResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            throw;
        }
    }
    


    public async Task<UserResponse?> CreateNewCustomerAsync(NewCustomer newCustomer)
    {
        var customer = _mapper.Map<Customer>(newCustomer);
        var result = await _userRepo.CreateCustomerAsync(customer);
        var accountVerification = await _userRepo.GetAccountVerificationByIdAndTypeAccountAsync(customer.CustomerId);
        if (result != null && result.IsEmailVerified == false)
        {
            var resultMail =
                await _mailService.SendVerificationEmailAsync(customer.Email, accountVerification.VerificationCode);
        }
        else if(result !=null && result.IsEmailVerified)
        {
            var sendMail = await _mailService.SendAccountCreatedEmailAsync(result.Email, result.FullName);
        }
        var customerRequest = _mapper.Map<UserResponse>(result);
        return customerRequest;
    }

    public async Task<UserResponse?> CustomerLoginByEmailAndPasswordAsync(FormLogin formLogin)
    {
        _logger.LogInformation("Starting login process for email: {Email}", formLogin.Email);

        var email = formLogin.Email;
        var password = formLogin.Password;

        try
        {
            var customer = await _userRepo.GetCustomerByEmailAsync(email);
            if (customer == null)
            {
                _logger.LogWarning("Login failed for email {Email}: Customer not found", email);
                return null;
            }

            if (customer.IsEmailVerified == false)
            {
                throw new Exception("Email is not verified");
            }
            if (BCrypt.Net.BCrypt.Verify(password, customer.PasswordHash))
            {
                _logger.LogInformation("Login successful for email {Email}", email);
                var cusResponst = _mapper.Map<UserResponse>(customer);
                return cusResponst;
            }

            _logger.LogWarning("Login failed for email {Email}: Incorrect password", email);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during login process for email {Email}", email);
            throw;
        }
    }

    public async Task<Page<UserResponse>?> GetCustomerByPageAsync(int page, int pageSize)
    {
        var customers = await _userRepo.GetCustomersPageAsync(page, pageSize);
        var totalCustomer = await _userRepo.CountCustomers();
        var customerRequests = _mapper.Map<List<UserResponse>>(customers);
        var pageResult = new Page<UserResponse>(customerRequests, page, pageSize, totalCustomer);
        return pageResult;
    }

    public async Task<UserResponse?> GetCustomerByEmailAsync(string email)
    {
        var customer = await _userRepo.GetCustomerByEmailAsync(email);
        var customerRequest = _mapper.Map<UserResponse>(customer);
        return customerRequest;
    }

    public async Task<UserResponse?> UpdateCustomerAsync(UpdateCustomer updateCustomer)
    {
        var customer = _mapper.Map<Customer>(updateCustomer);
        var result = await _userRepo.UpdateCustomerAsync(customer);
        var customerRequest = _mapper.Map<UserResponse>(result);
        return customerRequest;
    }


    public async Task<bool> SendVerificationCodeBackAsync(string email)
    {
        var customer = await _userRepo.GetCustomerByEmailAsync(email);
        if (customer == null)return false;
        var accountVerication = await _userRepo.CreateNewVefificationCodeAsync(customer.CustomerId);
        var sendMailresult = await 
            _mailService.SendVerificationEmailAsync(customer.Email, accountVerication.VerificationCode);
        return sendMailresult;
    }

    public async Task<UserResponse?> ConfirmEmailCustomerAsync(string email, string code)
    {
        try
        {
            var customer = await _userRepo.GetCustomerByEmailAsync(email);
            if (customer == null) return null;

            var accountVerification = await _userRepo.GetAccountVerificationByIdAndTypeAccountAsync(customer.CustomerId);
            if (accountVerification == null) return null;

            // Kiểm tra mã xác thực có đúng và có hết hạn chưa
            if (accountVerification.VerificationCode != code)
                return null;

            // Xác thực thành công, cập nhật trạng thái tài khoản
            var result = await _userRepo.ConfirmEmailCustomerSuccessAsync(customer.CustomerId);
            customer.IsEmailVerified = true;
            var customerRequest= await _userRepo.UpdateCustomerAsync(customer);
            if (customerRequest.IsEmailVerified)
            {
                await _mailService.SendAccountCreatedEmailAsync(customerRequest.Email, customer.FullName);
            }
            return _mapper.Map<UserResponse>(customerRequest);   
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during email confirmation");
            throw new Exception("An error occurred during email confirmation", ex);
        }
    }

    public async Task<Page<UserResponse>?> GetAllUserPageAsync(string role,int page, int size)
    {
        try
        {
            switch (role)
            {
                case "Customer":
                    var customers = await _userRepo.GetAllCustomersAsync();
                    var totalCustomer = await _userRepo.CountCustomers();
                    var customerResponses = _mapper.Map<List<UserResponse>>(customers);
                    return new Page<UserResponse>(customerResponses,page,size,totalCustomer);
                case "Employee":
                    var employees = await _userRepo.GetAllEmployeesAsync();
                    var totalEmployees = await _userRepo.CountEmployees();
                    var employeesResponses = _mapper.Map<List<UserResponse>>(employees);
                    return new Page<UserResponse>(employeesResponses,page,size,totalEmployees);
            }

            return null;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool> ResetPasswordAsync(ResetPassword resetPassword)
    {
        try
        {
            var emp = await _userRepo.GetEmployeeByEmailAsync(resetPassword.Email);
            if (emp != null)
            {
                emp.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPassword.Password); ;
                await _userRepo.UpdateEmployeeAsync(emp);
                return true;
            }
            else if (emp == null)
            {
                var cus = await _userRepo.GetCustomerByEmailAsync(resetPassword.Email);
                if (cus != null)
                {
                    cus.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPassword.Email);
                    await _userRepo.UpdateCustomerAsync(cus);
                    return true;
                }

                return false;
            }
            else return false;
        }
        catch (Exception ex)
        {
            throw;
        }
    }
    public async Task<UserResponse?> GetCustomerByIdAsync(int customerId)
    {
        var customer = await _userRepo.GetCustomerByIdAsync(customerId);
        var customerResponse = _mapper.Map<UserResponse>(customer);
        return customerResponse;
    }
}
