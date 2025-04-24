using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;

namespace BusinessLogicLayer.Services.Interface;

public interface IMailService
{
    public Task<bool> SendEmailAsync(string toEmail, string subject, string body);
    /// <summary>
    /// send new verification code to email
    /// </summary>
    /// <param name="toEmail"></param>
    /// <param name="verificationCode"></param>
    /// <returns></returns>
    public Task<bool> SendVerificationEmailAsync(string toEmail, string verificationCode);
    public Task<bool> SendOrderConfirmationEmailAsync(OrderResponse orderResponse);
    public  Task<bool> SendAccountCreatedEmailAsync(string toEmail, string username);
    Task<bool> SendResetPasswordEmail(string userEmail, string resetUrl);
    Task SendOrderFailureEmailAsync(NewOrder order);
}