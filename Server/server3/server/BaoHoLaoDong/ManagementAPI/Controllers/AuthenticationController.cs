using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Interface;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;

namespace ManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly TokenService _tokenService;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly HttpClient _httpClient;
        private readonly int expriryDay = 7;
        public AuthenticationController(
            IUserService userService,
            TokenService tokenService,
            IConfiguration configuration,
            IMailService mailService,
            ILogger<AuthenticationController> logger)
        {
            _userService = userService;
            _tokenService = tokenService;
            _logger = logger;
            _configuration = configuration;
            _httpClient = new HttpClient();
            _mailService = mailService;
        }

        [HttpPost("authenticate/loginby-email-password")]
        public async Task<IActionResult> LoginByPassword([FromBody] FormLogin formLogin)
        {
            if (formLogin == null || string.IsNullOrWhiteSpace(formLogin.Email) || string.IsNullOrWhiteSpace(formLogin.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            try
            {
                var user = await _userService.UserLoginByEmailAndPasswordAsync(formLogin);
                if (user == null || user.Status == "InActive")
                {
                    return Unauthorized("Invalid email or password.");
                }

                var token = _tokenService.GenerateJwtTokenByDays(user.Email, user.Id, user.Role,expriryDay);
                return Ok(new { token, email = user.Email, role = user.Role, userId = user.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login process for email {Email}", formLogin.Email);
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        public class GoogleLoginDTO
        {
            public string GoogleToken { get; set; }
        }

        [HttpPost("authenticate/loginby-google")]
        public async Task<IActionResult> LoginByGoogle([FromBody] GoogleLoginDTO request)
        {
            if (string.IsNullOrEmpty(request?.GoogleToken))
            {
                return BadRequest("Google token is required.");
            }
            try
            {
                var payload = await ValidateGoogleTokenViaApi(request.GoogleToken);
                if (payload == null)
                {
                    return Unauthorized(new {message= "Invalid Google token."});
                }

                var user = await _userService.GetUserByEmailAsync(payload.Email);
                if (user == null || user.Status == "InActive")
                {
                    return Unauthorized("Invalid email or password.");
                }
                var token = _tokenService.GenerateJwtTokenByDays(user.Email, user.Id, user.Role,expriryDay);
                return Ok(new { token, userId = user.Id, email = user.Email, role = user.Role ,imageUrl=user.ImageUrl});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Google authentication failed for token {Token}", request.GoogleToken);
                return StatusCode(500, "An internal server error occurred.");
            }
        }
        
        [HttpPost("authenticate/registerby-google")]
        public async Task<IActionResult> RegisterByGoogle([FromBody] GoogleLoginDTO request)
        {
            if (string.IsNullOrEmpty(request?.GoogleToken))
            {
                return BadRequest("Google token is required.");
            }

            try
            {
                var payload = await ValidateGoogleTokenViaApi(request.GoogleToken);
                if (payload == null)
                {
                    return Unauthorized("Invalid Google token.");
                }

                var user = await _userService.GetUserByEmailAsync(payload.Email);
                if (user != null)
                {
                    return BadRequest("User already exists.");
                }

                var newUser = new NewCustomer
                {
                    Email = payload.Email,
                    FullName = payload.Name,
                    IsEmailVerified = true,
                    ImageUrl = payload.Picture,
                    Address = payload.Locale,
                    DateOfBirth = null,
                    Password = "user@123"
                };
                _logger.LogInformation("picture url: {Picture}", payload.Picture);
                var createdUser = await _userService.CreateNewCustomerAsync(newUser);
                if (createdUser == null)
                {
                    return StatusCode(500, "An internal server error occurred.");
                }

                var token = _tokenService.GenerateJwtTokenByDays(createdUser.Email, createdUser.Id, createdUser.Role,expriryDay);
                return Ok(new { token, userId = createdUser.Id, email = createdUser.Email, role = createdUser.Role ,imageUrl=createdUser.ImageUrl});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Google registration failed for token {Token}", request.GoogleToken);
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        private async Task<GoogleJsonWebSignature.Payload?> ValidateGoogleTokenViaApi(string googleToken)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={googleToken}");
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Google token validation via API failed with status code: {StatusCode}", response.StatusCode);
                    return null;
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var payload = JObject.Parse(jsonResponse);

                return new GoogleJsonWebSignature.Payload
                {
                    Email = payload["email"]?.ToString(),
                    Name = payload["name"]?.ToString(),
                    Issuer = payload["iss"]?.ToString(),
                    Audience = payload["aud"]?.ToString(),
                    Picture = payload["picture"]?.ToString(),
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Google token validation via API failed: {Message}", ex.Message);
                return null;
            }
        }
        
        [HttpPost("authenticate/registerby-email-password")]
        public async Task<IActionResult> RegisterByPassword([FromBody] NewCustomer newCustomer)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(newCustomer.Email);
                if (user != null)
                {
                    return BadRequest("User already exists.");
                }

                var createdUser = await _userService.CreateNewCustomerAsync(newCustomer);
                if (createdUser == null)
                {
                    return StatusCode(500, "An internal server error occurred.");
                }

                var token = _tokenService.GenerateJwtTokenByDays(createdUser.Email, createdUser.Id, createdUser.Role,expriryDay);
                return Ok(new { token, userId = createdUser.Id, email = createdUser.Email, role = createdUser.Role ,imageUrl=createdUser.ImageUrl});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration process for email {Email}", newCustomer.Email);
                return StatusCode(500, "An internal server error occurred.");
            }
        }
        
        [HttpPost("authenticate/request-reset-password")]
        public async Task<IActionResult> RequestResetPassword([FromQuery] [EmailAddress] [Required] string email)
        {
            
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var resetToken = _tokenService.GenerateJwtTokenByMinutes(user.Email, user.Id, user.Role,1);
            var resetUrl = $"{_configuration["ApplicationSettings:UrlResetPassword"]}?email={email}&token={resetToken}&time={DateTime.Now.AddMinutes(5)}";
            await _mailService.SendResetPasswordEmail(user.Email, resetUrl);
            return Ok(new
            {
                message = "Reset password email sent successfully." ,
                resetUrl = resetUrl,
            });
        }

        [HttpPost("authenticate/reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword resetPassword)
        {
            try
            {
                var isToken = _tokenService.IsValidToken(resetPassword.Token);
                if (isToken)
                {
                    var result = await _userService.ResetPasswordAsync( resetPassword);
                    if (result)
                    {
                        return Ok("Reset password successfully.");
                    }
                    return BadRequest("Reset password failed.");
                }
               return BadRequest("Invalid token.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
