using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessLogicLayer.Models;
using Microsoft.IdentityModel.Tokens;

namespace BusinessLogicLayer.Services;

public class TokenService
{
    private readonly Token _token;

    public TokenService(Token token)
    {
        _token = token;
    }

    // 🔹 Hàm tạo token với thời gian hết hạn theo ngày
    public string GenerateJwtTokenByDays(string email, int employeeId, string role, int expiryDays)
    {
        return GenerateJwtToken(email, employeeId, role, DateTime.UtcNow.AddDays(expiryDays));
    }

    // 🔹 Hàm tạo token với thời gian hết hạn theo phút
    public string GenerateJwtTokenByMinutes(string email, int employeeId, string role, int expiryMinutes)
    {
        return GenerateJwtToken(email, employeeId, role, DateTime.UtcNow.AddMinutes(expiryMinutes));
    }

    // 🔹 Hàm chung để tạo token với thời gian hết hạn truyền vào
    private string GenerateJwtToken(string email, int employeeId, string role, DateTime expiryTime)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_token.key);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, employeeId.ToString()),
                new Claim(ClaimTypes.Role, role)
            }),
            Expires = expiryTime,
            Issuer = _token.issuer,
            Audience = _token.audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    public bool IsValidToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_token.key);

        try
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _token.issuer,
                ValidateAudience = true,
                ValidAudience = _token.audience,
                ValidateLifetime = true, // Kiểm tra thời gian hết hạn
                ClockSkew = TimeSpan.Zero // Không chấp nhận thời gian chênh lệch
            };

            tokenHandler.ValidateToken(token, parameters, out _);
            return true; // Token hợp lệ
        }
        catch
        {
            return false; // Token không hợp lệ hoặc đã hết hạn
        }
    }

    
}