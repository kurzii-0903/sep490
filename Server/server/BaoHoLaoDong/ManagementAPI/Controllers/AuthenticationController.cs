using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace ManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly TokenService _tokenService;
        private readonly string _googleClientId;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly HttpClient _httpClient;

        public AuthenticationController(
            IUserService userService,
            TokenService tokenService,
            IConfiguration configuration,
            ILogger<AuthenticationController> logger)
        {
            _userService = userService;
            _tokenService = tokenService;
            _logger = logger;
            _googleClientId = configuration["GoogleAuth:ClientId"];
            _httpClient = new HttpClient();
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
                if (user == null)
                {
                    return Unauthorized("Invalid email or password.");
                }

                var token = _tokenService.GenerateJwtToken(user.Email, user.Id, user.Role);
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
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found." });
                }
                var token = _tokenService.GenerateJwtToken(user.Email, user.Id, user.Role);
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

                var token = _tokenService.GenerateJwtToken(createdUser.Email, createdUser.Id, createdUser.Role);
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
            if (newCustomer == null || string.IsNullOrWhiteSpace(newCustomer.Email) || string.IsNullOrWhiteSpace(newCustomer.Password))
            {
                return BadRequest("Email and Password are required.");
            }

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

                var token = _tokenService.GenerateJwtToken(createdUser.Email, createdUser.Id, createdUser.Role);
                return Ok(new { token, userId = createdUser.Id, email = createdUser.Email, role = createdUser.Role ,imageUrl=createdUser.ImageUrl});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration process for email {Email}", newCustomer.Email);
                return StatusCode(500, "An internal server error occurred.");
            }
        }
    }
}
