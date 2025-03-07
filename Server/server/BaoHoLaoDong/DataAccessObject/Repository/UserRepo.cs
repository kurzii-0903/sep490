using BusinessObject.Entities;
using DataAccessObject.Dao;
using DataAccessObject.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccessObject.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly CustomerDao _customerDao;
        private readonly EmployeeDao _employeeDao;
        private readonly AccountVerificationDao _accountVerificationDao;

        public UserRepo(MinhXuanDatabaseContext context)
        {
            _customerDao = new CustomerDao(context);
            _employeeDao = new EmployeeDao(context);
            _accountVerificationDao = new AccountVerificationDao(context);
        }

        #region Customer
        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            return await _customerDao.GetByIdAsync(id);
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            return await _customerDao.GetByEmailAsync(email);
        }

        public async Task<Customer?> GetCustomerByPhoneAsync(string phone)
        {
            return await _customerDao.GetByPhoneAsync(phone); // Call the DAO method
        }

        public async Task<Customer?> CreateCustomerAsync(Customer customer)
        {
            // Check if the customer with the same email already exists
            var existingCustomer = await _customerDao.GetByEmailAsync(customer.Email);
            if (existingCustomer != null)
            {
                throw new ArgumentException("Customer with this email already exists.");
            }
            var newCustomer= await _customerDao.CreateAsync(customer);
            if (customer != null && customer.IsEmailVerified == false)
            {
                await _accountVerificationDao.CreateAsync(new AccountVerification
                {
                    AccountId = newCustomer.CustomerId,
                    VerificationCode = new Random().Next(100000, 999999).ToString(),
                    AccountType = "Customer",
                    IsVerified = false,
                    VerificationDate = DateTime.Now.AddMinutes(5)
                });
            }
            return newCustomer;
        }

        public async Task<Customer?> UpdateCustomerAsync(Customer customer)
        {
            var existingCustomer = await _customerDao.GetByIdAsync(customer.CustomerId);
            if (existingCustomer == null)
            {
                throw new ArgumentException("Customer not found.");
            }

            return await _customerDao.UpdateAsync(customer);
        }

        public async Task<List<Customer>?> GetCustomersPageAsync(int page, int pageSize)
        {
            return await _customerDao.GetPageAsync(page, pageSize);
        }

        public async Task<List<Customer>?> GetAllCustomersAsync()
        {
            return await _customerDao.GetAllAsync();
        }

        public async Task<AccountVerification?> CreateNewVefificationCodeAsync(int accountId)
        {
            var accountVerification = await _accountVerificationDao.GetByAccountIdAsync(accountId);
            if (accountVerification == null) return null;
            accountVerification.VerificationCode = new Random().Next(100000, 999999).ToString();
            accountVerification.VerificationDate = DateTime.Now.AddMinutes(5);
            return await _accountVerificationDao.UpdateAsync(accountVerification);
        }

        #endregion Customer

        #region Employee
        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _employeeDao.GetByIdAsync(id);
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string email)
        {
            return await _employeeDao.GetEmployeeByEmailAsync(email);
        }

        public async Task<Employee?> GetEmployeeByPhoneAsync(string phone)
        {
            return await _employeeDao.GetEmployeeByPhoneAsync(phone);
        }

        public async Task<Employee?> CreateEmployeeAsync(Employee employee)
        {
            var existingEmployee = await _employeeDao.GetEmployeeByEmailAsync(employee.Email);
            if (existingEmployee != null)
            {
                throw new ArgumentException("Employee with this email already exists.");
            }

            return await _employeeDao.CreateAsync(employee);
        }

        public async Task<Employee?> UpdateEmployeeAsync(Employee employee)
        {
            if (employee == null)
            {
                throw new ArgumentNullException(nameof(employee), "Employee object cannot be null.");
            }

            var existingEmployee = await _employeeDao.GetByIdAsync(employee.EmployeeId);
            if (existingEmployee == null)
            {
                throw new ArgumentException("Employee not found.");
            }
            if (employee.Email != existingEmployee.Email)
            {
                var employeeWithEmail = await _employeeDao.GetEmployeeByEmailAsync(employee.Email);
                if (employeeWithEmail != null)
                {
                    throw new Exception($"Email '{employee.Email}' is already in use.");
                }
            }
            return await _employeeDao.UpdateAsync(employee);
        }


        public async Task<List<Employee>?> GetEmployeesPageAsync(int page, int pageSize)
        {
            return await _employeeDao.GetPageAsync(page, pageSize);
        }

        public async Task<List<Employee>?> GetAllEmployeesAsync()
        {
            return await _employeeDao.GetAllAsync();
        }

        public async Task<AccountVerification?> GetAccountVerificationByIdAndTypeAccountAsync(int id)
        {
            return await _accountVerificationDao.GetByAccountIdAsync(id);
        }

        public async Task<int> CountCustomers()
        {
            return await _customerDao.CountAsync();
        }

        public async Task<int> CountEmployees()
        {
            return await _employeeDao.CountAsync();
        }

        public async Task<AccountVerification?> ConfirmEmailCustomerSuccessAsync(int customerCustomerId)
        {
            var accountVerification = await _accountVerificationDao.GetByAccountIdAsync(customerCustomerId);
            if (accountVerification == null) return null;
            accountVerification.IsVerified = true;
            return await _accountVerificationDao.UpdateAsync(accountVerification);
        }

        #endregion Employee
    }
}
