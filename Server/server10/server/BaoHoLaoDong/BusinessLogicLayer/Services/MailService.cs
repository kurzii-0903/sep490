using System.Globalization;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Models;
using MimeKit;
using MailKit.Net.Smtp;
using BusinessLogicLayer.Services.Interface;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using Microsoft.Extensions.Options;

namespace BusinessLogicLayer.Services
{
    public class MailService : IMailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ApplicationUrls _applicationUrls;

        public MailService(IOptions<EmailSettings> emailSettings, IOptions<ApplicationUrls> applicationUrls)
        {
            _emailSettings = emailSettings.Value;
            _applicationUrls = applicationUrls.Value;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string username)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("No Reply", _emailSettings.SmtpUser ));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                // HTML content with account registration details
                string htmlBody = $@"
                    <html>
                        <body>
                            <h2>Chào mừng bạn đến với hệ thống của chúng tôi!</h2>
                            <p>Xin chúc mừng, {username}! Bạn đã đăng ký tài khoản thành công.</p>
                            <p>Thông tin tài khoản của bạn:</p>
                            <table border='1' cellpadding='10'>
                                <tr>
                                    <td><strong>Tên tài khoản</strong></td>
                                    <td>{username}</td>
                                </tr>
                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>{toEmail}</td>
                                </tr>
                            </table>
                            <p>Vui lòng lưu thông tin này để đăng nhập và sử dụng các dịch vụ của chúng tôi.</p>
                            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                            <p>Chúc bạn có một trải nghiệm tuyệt vời!</p>
                            <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
                        </body>
                    </html>";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, true);
                    await client.AuthenticateAsync(_emailSettings.SmtpUser , _emailSettings.SmtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendVerificationEmailAsync(string toEmail, string verificationCode)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Bảo Hộ Lao Động Minh Xuân", _emailSettings.SmtpUser ));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = "Mã xác thực tài khoản của bạn";

                // Tạo đường dẫn xác thực
                string verificationLink = $"{_applicationUrls.ClientUrl}/verification?email={toEmail}&verifyCode={verificationCode}";

                // Nội dung email với mã xác thực và nút xác thực
                string htmlBody = $@"
                <html>
                    <body>
                        <h2>Chào bạn!</h2>
                        <p>Để hoàn tất quá trình đăng ký tài khoản, vui lòng nhập mã xác thực dưới đây hoặc nhấn vào nút để xác thực tài khoản của bạn:</p>
                        
                        <p><strong>Mã xác thực:</strong> {verificationCode}</p>
                        
                        <p>Hoặc bạn có thể nhấn vào nút dưới đây để xác thực tài khoản:</p>
                        <a href='{verificationLink}' style='padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;'>Xác thực tài khoản</a>

                        <p>Vui lòng không chia sẻ mã xác thực này với bất kỳ ai để bảo mật tài khoản của bạn.</p>
                        <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
                    </body>
                </html>";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, true);
                    await client.AuthenticateAsync(_emailSettings.SmtpUser , _emailSettings.SmtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending verification email: {ex.Message}");
                return false;
            }
        }

        public async Task<byte[]> GenerateOrderPdfAsync(OrderResponse order)
    {
        try
        {
            CultureInfo culture = new CultureInfo("vi-VN");

            string htmlContent = $@"
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                        table {{ width:100%; border-collapse: collapse; margin-top: 10px; }}
                        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                        th {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h2>Chào {order.FullName},</h2>
                    <p>Cảm ơn bạn đã đặt hàng! Mã đơn hàng: <strong>{order.OrderId}</strong></p>

                    <h3>Thông tin đơn hàng:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>";

            foreach (var detail in order.OrderDetails)
            {
                htmlContent += $@"
                    <tr>
                        <td><img src='{detail.ProductImage}' width='50' height='50' /></td>
                        <td>{detail.ProductName}</td>
                        <td>{detail.Quantity}</td>
                        <td>{detail.ProductPrice.ToString("C0", culture)}</td>
                        <td>{(detail.Quantity * detail.ProductPrice).ToString("C0", culture)}</td>
                    </tr>";
            }

            htmlContent += $@"
                        </tbody>
                    </table>
                    <p><strong>Tổng giá trị đơn hàng: {order.TotalAmount.ToString("C0", culture)}</strong></p>
                    <p>Trân trọng,<br><strong>Đội ngũ hỗ trợ</strong></p>
                </body>
            </html>";

            using (var memoryStream = new MemoryStream())
            {
                using (var writer = new PdfWriter(memoryStream))
                {
                    using (var pdfDocument = new PdfDocument(writer))
                    {
                        ConverterProperties properties = new ConverterProperties();
                        HtmlConverter.ConvertToPdf(htmlContent, pdfDocument, properties);
                    }
                }
                return memoryStream.ToArray();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating PDF: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> SendOrderConfirmationEmailAsync(OrderResponse order)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("No Reply", _emailSettings.SmtpUser));
            message.To.Add(new MailboxAddress("", order.Email));
            message.Subject = "Xác nhận đơn hàng của bạn";

            CultureInfo culture = new CultureInfo("vi-VN");

            string orderDetailsTable = $@"
                <table style='width:100%; border-collapse: collapse; font-family: Arial, sans-serif;'>
                    <thead>
                        <tr style='background-color: #f2f2f2;'>
                            <th style='border: 1px solid #ddd; padding: 8px; text-align: center;'>Ảnh</th>
                            <th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Sản phẩm</th>
                            <th style='border: 1px solid #ddd; padding: 8px; text-align: center;'>Số lượng</th>
                            <th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Đơn giá</th>
                            <th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>";

            foreach (var detail in order.OrderDetails)
            {
                orderDetailsTable += $@"
                        <tr>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>
                            <img src='{detail.ProductImage}' alt='{detail.ProductName}' style='width: 50px; height: 50px; object-fit: cover; border-radius: 5px;' />
                            </td>
                            <td style='border: 1px solid #ddd; padding: 8px;'>{detail.ProductName}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>{detail.Quantity}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{detail.ProductPrice.ToString("C0", culture)}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{(detail.Quantity * detail.ProductPrice).ToString("C0", culture)}</td>
                        </tr>";
            }

            orderDetailsTable += @"
                    </tbody>
                </table>";

            string htmlBody = $@"
            <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #333;'>Chào {order.FullName},</h2>
                    <p>Cảm ơn bạn đã đặt hàng! Đơn hàng có mã: <strong>{order.OrderId}</strong>.</p>
                    
                    <h3>Thông tin đơn hàng:</h3>
                    {orderDetailsTable}
                    
                    <p style='font-size: 16px;'><strong>Tổng giá trị đơn hàng: {order.TotalAmount.ToString("C0", culture)}</strong></p>

                    <p style='text-align: center; margin-top: 20px;'>
                        <a href='{_applicationUrls.ClientUrl}/checkout?invoiceNumber={order.Invoice.InvoiceNumber}' 
                           style='display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;'>
                           👉 Thanh toán ngay
                        </a>
                    </p>
                    
                    <p>Chúng tôi sẽ xử lý đơn hàng và thông báo khi đơn hàng được giao.</p>
                    
                    <p>Trân trọng,<br /><strong>Đội ngũ hỗ trợ</strong></p>
                </body>
            </html>";

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            var pdfBytes = await GenerateOrderPdfAsync(order);

            if (pdfBytes != null)
            {
                bodyBuilder.Attachments.Add("OrderDetails.pdf", pdfBytes, ContentType.Parse("application/pdf"));
            }

            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, true);
                await client.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
            return false;
        }
    }

        public async Task<bool> SendAccountCreatedEmailAsync(string toEmail, string username)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("No Reply", _emailSettings.SmtpUser ));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = "Tài khoản của bạn đã được tạo thành công";
                string htmlBody = $@"
                    <html>
                        <body>
                            <h2>Chào mừng bạn đến với hệ thống của chúng tôi!</h2>
                            <p>Xin chúc mừng, {username}! Bạn đã đăng ký tài khoản thành công.</p>
                            <p>Thông tin tài khoản của bạn:</p>
                            <table border='1' cellpadding='10'>
                                <tr>
                                    <td><strong>Tên tài khoản</strong></td>
                                    <td>{username}</td>
                                </tr>
                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>{toEmail}</td>
                                </tr>
                            </table>
                            <p>Vui lòng lưu thông tin này để đăng nhập và sử dụng các dịch vụ của chúng tôi.</p>
                            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                            <p>Chúc bạn có một trải nghiệm tuyệt vời!</p>
                            <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
                        </body>
                    </html>";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, true);
                    await client.AuthenticateAsync(_emailSettings.SmtpUser , _emailSettings.SmtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending account creation email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendResetPasswordEmail(string userEmail, string resetUrl)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("No Reply", _emailSettings.SmtpUser ));
                message.To.Add(new MailboxAddress("", userEmail));
                message.Subject = "Đặt lại mật khẩu của bạn";

                // Nội dung email HTML
                string htmlBody = $@"
                <html>
                    <body>
                        <h2>Xin chào,</h2>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                        <a href='{resetUrl}' style='padding: 10px 20px; background-color: #ff5722; color: white; text-decoration: none; border-radius: 5px;'>Đặt lại mật khẩu</a>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                        <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
                    </body>
                </html>";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, true);
                    await client.AuthenticateAsync(_emailSettings.SmtpUser , _emailSettings.SmtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending password reset email: {ex.Message}");
                return false;
            }
        }

        public async Task SendOrderFailureEmailAsync(NewOrder order)
        {
            var subject = "Đơn hàng không thành công";
            var body = $"Xin chào {order.CustomerEmail},<br><br>Chúng tôi rất tiếc thông báo rằng đơn hàng của bạn không thể hoàn thành do một số sản phẩm đã hết hàng.<br><br>Vui lòng thử đặt hàng lại sau.<br><br>Trân trọng, <br>Đội ngũ hỗ trợ.";
    
            await SendEmailAsync(order.CustomerEmail, subject, body);
        }

    }
}