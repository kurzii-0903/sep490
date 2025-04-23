using System.Text;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Mappings;
using BusinessLogicLayer.Models;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using DataAccessObject.Repository;
using DataAccessObject.Repository.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
var environment = builder.Environment.EnvironmentName;
if (environment == "Development")
{
    builder.Configuration
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.Development.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables();
}
else
{
    // Đọc từ web.config thông qua biến môi trường được thiết lập trong IIS hoặc server
    builder.Configuration
        .AddEnvironmentVariables();
}

#region JWT
// Lấy cấu hình JWT từ appsettings.json
var jwtConfig = builder.Configuration.GetSection("Jwt");

// JWT
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var token = jwtConfig.Get<Token>(); // Sử dụng Get<T> để dễ dàng ánh xạ cấu hình từ JSON

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = token.issuer,
            ValidAudience = token.audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(token.key))
        };
    });

// Cấu hình Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Customer", policy => policy.RequireRole("Customer"));
    options.AddPolicy("Manager", policy => policy.RequireRole("Manager"));
    options.AddPolicy("AdminOrManager", policy =>
    {
        policy.RequireRole("Admin", "Manager");
    });
});
#endregion JWT
#region repository

builder.Services.AddScoped<IBlogPostRepository,BlogPostRepository>();
builder.Services.AddScoped<IInvoiceRepository,InvoiceRepository>();
builder.Services.AddScoped<INotificationRepository,NotificationRepository>();
builder.Services.AddScoped<IOrderRepository,OrderRepository>();
builder.Services.AddScoped<IProductRepository,ProductRepository>();
builder.Services.AddScoped<ITaxRepository,TaxRepository>();
builder.Services.AddScoped<IUserRepository,UserRepository>();

#endregion
// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
builder.Services.AddDbContext<MinhXuanDatabaseContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnections")));
// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

#region services
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
// Đọc cấu hình SMTP từ appsettings.json
builder.Services.Configure<ApplicationUrls>(builder.Configuration.GetSection("ApplicationSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
// Add services from BusinessLogicLayer
builder.Services.AddScoped<IUserService, UserService>();
var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
builder.Services.AddSingleton<IOrderQueueService,OrderQueueService>();
builder.Services.AddSingleton(imageDirectory);
builder.Services.AddScoped<IFileService,FileService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IBlogPostService, BlogPostService>();
builder.Services.AddScoped<ITaxService, TaxService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHostedService<OrderQueueWorker>();
// Đăng ký MailService
builder.Services.AddScoped<IMailService, MailService>();
// Add TokenService
builder.Services.AddScoped<TokenService>(provier =>
{
    var token = jwtConfig.Get<Token>();
    return new TokenService(token);
});
#endregion services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
else if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.MapHub<ProductHub>("/productHub");
app.MapHub<BlogPostHub>("/blogHub");
app.MapHub<NotificationHub>("/notificationHub");
app.MapHub<OrderHub>("/orderHub");
app.MapHub<InvoiceHub>("/invoiceHub");

app.Run();