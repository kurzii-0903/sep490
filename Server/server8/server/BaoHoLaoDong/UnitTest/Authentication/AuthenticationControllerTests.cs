using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using BusinessLogicLayer.Services.Interface;
using BusinessLogicLayer.Services;
using ManagementAPI.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using BusinessLogicLayer.Mappings.RequestDTO;
using Microsoft.AspNetCore.Routing;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;

namespace UnitTest.Authentication
{
    [TestFixture]
    public class AuthenticationControllerTests
    {
        private Mock<IUserService> _mockUserService;
        private TokenService _tokenService;
        private Mock<IMailService> _mockMailService;
        private Mock<IConfiguration> _mockConfiguration;
        private Mock<ILogger<AuthenticationController>> _mockLogger;
        private AuthenticationController _controller;
        [SetUp]
        public void SetUp()
        {

            _mockUserService = new Mock<IUserService>();
            _mockMailService = new Mock<IMailService>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockLogger = new Mock<ILogger<AuthenticationController>>();

            var token = new Token
            {
                key = "925882d5f15cca6cf0046230fcf6ad7f48c37be982a1de72f77240addf2a634c",
                issuer = "http://localhost:5000",
                audience = "http://localhost:5000",
                expriryInDay = 3
            };
            _tokenService = new TokenService(token);
            _controller = new AuthenticationController(
                _mockUserService.Object,
                _tokenService,
                _mockConfiguration.Object,
                _mockMailService.Object,
                _mockLogger.Object
            );
        }
        
        [Test]
        public async Task LoginByPassword_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var formLogin = new FormLogin { Email = "test@example.com", Password = "password123" };
            var user = new UserResponse { Id = 1, Email = "test@example.com", RoleName = "User", Status = "Active" };

            _mockUserService.Setup(u => u.UserLoginByEmailAndPasswordAsync(formLogin))
                            .ReturnsAsync(user);

            _tokenService = new TokenService(new Token
            {
                key = "925882d5f15cca6cf0046230fcf6ad7f48c37be982a1de72f77240addf2a634c",
                issuer = "http://localhost:5000",
                audience = "http://localhost:5000",
                expriryInDay = 3
            });

            // Act
            var result = await _controller.LoginByPassword(formLogin);

            //  Kiểm tra kết quả trả về có phải `OkObjectResult`
            Assert.That(result, Is.InstanceOf<OkObjectResult>(), "❌ API không trả về OkObjectResult!");

            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null, "❌ API không trả về kết quả hợp lệ!");

            //  Debug
            Console.WriteLine($"DEBUG: okResult.Value = {okResult?.Value}");
            Console.WriteLine($"DEBUG: Type of okResult.Value = {okResult?.Value?.GetType().FullName}");

         
            var responseDict = okResult.Value.GetType().GetProperties()
                                .ToDictionary(prop => prop.Name, prop => prop.GetValue(okResult.Value));

            Assert.That(responseDict, Is.Not.Null, "❌ API response is null!");
            Assert.That(responseDict.ContainsKey("token"), "❌ API không chứa token!");
            Assert.That(responseDict["token"].ToString(), Does.Contain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"), "❌ Token không hợp lệ!");

            Assert.That(responseDict["email"].ToString(), Is.EqualTo("test@example.com"), "❌ Email không đúng!");
            Assert.That(responseDict["role"].ToString(), Is.EqualTo("User"), "❌ Role không đúng!");
            Assert.That(Convert.ToInt32(responseDict["userId"]), Is.EqualTo(1), "❌ UserId không đúng!");
        }
        [Test]
        public async Task LoginByPassword_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var formLogin = new FormLogin { Email = "test@example.com", Password = "wrongpassword" };

            _mockUserService.Setup(u => u.UserLoginByEmailAndPasswordAsync(formLogin))
                            .ReturnsAsync((UserResponse)null);

            // Act
            var result = await _controller.LoginByPassword(formLogin);

            // Assert
            Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
        }
        [Test]
        public async Task LoginByPassword_InactiveUser_ReturnsUnauthorized()
        {
            // Arrange
            var formLogin = new FormLogin { Email = "inactive@example.com", Password = "password123" };
            var user = new UserResponse { Id = 1, Email = "inactive@example.com", RoleName = "User", Status = "InActive" };

            _mockUserService.Setup(u => u.UserLoginByEmailAndPasswordAsync(formLogin))
                            .ReturnsAsync(user);

            // Act
            var result = await _controller.LoginByPassword(formLogin);

            // Assert
            Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
        }
        [Test]
        public async Task ResetPassword_InvalidEmail_ReturnsNotFound()
        {
            // Arrange
            var resetRequest = new ResetPassword
            {
                Email = "invalid@example.com",
                Token = "123456",
                Password = "NewPass123!"
            };

            _mockUserService.Setup(u => u.ResetPasswordAsync(It.IsAny<ResetPassword>()))
                .ReturnsAsync(false); 

            var result = await _controller.ResetPassword(resetRequest);

            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>(), "❌ Không trả về NotFoundObjectResult!");
        }



        //[Test]
        //public async Task ResetPassword_InvalidOtp_ReturnsUnauthorized()
        //{
        //    // Arrange
        //    var resetRequest = new ResetPassword
        //    {
        //        Email = "test@example.com",
        //        Token = "invalid", // ❌ Token sai
        //        Password = "NewPass123!"
        //    };

        //    _mockUserService.Setup(u => u.GetUserByEmailAsync(resetRequest.Email))

        //                    .ReturnsAsync(new User{ Email = resetRequest.Email }); // 🔹 User hợp lệ

        //    _mockTokenService.Setup(t => t.IsValidToken(resetRequest.Token))
        //                     .Returns(false); // 🔹 Token không hợp lệ

        //    // Act
        //    var result = await _controller.ResetPassword(resetRequest);

        //    // Assert
        //    Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>(), "❌ Không trả về UnauthorizedObjectResult!");
        //}

        //[Test]
        //public async Task ResetPassword_ValidEmailAndOtp_ReturnsOk()
        //{
        //    // Arrange
        //    var resetRequest = new ResetPassword
        //    {
        //        Email = "test@example.com",
        //        Token = "123456",
        //        Password = "NewPass123!"
        //    };

        //    _mockUserService.Setup(u => u.GetUserByEmailAsync(It.IsAny<string>()))
        //         .ReturnsAsync(new UserResponse { Email = "test@example.com" }); // 🔹 Giả lập user tồn tại



        //    // Act
        //    var result = await _controller.ResetPassword(resetRequest);

        //    // Assert
        //    Assert.That(result, Is.InstanceOf<OkObjectResult>());
        //}

    }
}
