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
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var baseUrl = builder.Configuration["ApplicationSettings:BaseUrl"] ?? "http://localhost:5000";
var clientUrl = builder.Configuration["ApplicationSettings:ClientUrl"] ?? "http://localhost:3000";
var urlResetPassword = builder.Configuration["ApplicationSettings:UrlResetPassword"];
var googleClientId = builder.Configuration["GoogleAuth:ClientId"];
var imagePathBill = builder.Configuration["ApplicationSettings:FolderBill"];

builder.WebHost.UseUrls(baseUrl);
#region JWT
// Lấy cấu hình JWT từ appsettings.json
var jwtConfig = builder.Configuration.GetSection("Jwt");
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddEnvironmentVariables();  // Đọc từ biến môi trường (nếu có)

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

// Add services to the container.
builder.Services.AddControllers()
    .AddOData(opt =>
        opt.Select() // Hỗ trợ $select
            .Filter() // Hỗ trợ $filter
            .OrderBy()
            .Expand() // Hỗ trợ $expand
            .SetMaxTop(100) // Giới hạn số bản ghi
        );
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
// Add database context
builder.Services.AddDbContext<MinhXuanDatabaseContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnections")));

// Add AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    var configuration = builder.Configuration;
    var applicationUrl = configuration["ApplicationSettings:BaseUrl"] ?? "http://localhost:5000";
    cfg.AddProfile(new MappingProfile(applicationUrl));
});

#region repository

builder.Services.AddScoped<IBlogPostRepo,BlogPostRepo>();
builder.Services.AddScoped<IInvoiceRepo,InvoiceRepo>();
builder.Services.AddScoped<INotificationRepo,NotificationRepo>();
builder.Services.AddScoped<IOrderRepo,OrderRepo>();
builder.Services.AddScoped<IProductRepo,ProductRepo>();
builder.Services.AddScoped<ITaxRepo,TaxRepo>();
builder.Services.AddScoped<IUserRepo,UserRepo>();

#endregion
#region services
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
// Đọc cấu hình SMTP từ appsettings.json
builder.Services.Configure<ApplicationUrls>(builder.Configuration.GetSection("ApplicationSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
// Add services from BusinessLogicLayer
builder.Services.AddScoped<IUserService, UserService>();
var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
builder.Services.AddSingleton<IOrderQueueService>(provider =>
{
    var redisConnection = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
    return new OrderQueueService(redisConnection);
});
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


// Cấu hình CORS 
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(clientUrl) // Địa chỉ frontend React
            .AllowAnyHeader() // Cho phép mọi header
            .AllowAnyMethod() // Cho phép mọi method (GET, POST, v.v.)
            .AllowCredentials(); // Cho phép gửi cookies hoặc thông tin xác thực
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(); // Thêm middleware CORS vào pipeline xử lý HTTP
app.UseAuthentication(); 
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();
if (app.Environment.IsDevelopment()!)
{
    var process = new System.Diagnostics.Process
    {
        StartInfo = new System.Diagnostics.ProcessStartInfo
        {
            FileName = $"{baseUrl}/swagger/index.html",
            UseShellExecute = true
        }
    };
    process.Start();
}

app.MapHub<ProductHub>("/productHub");
app.MapHub<BlogPostHub>("/blogHub");
app.MapHub<NotificationHub>("/notificationHub");
app.MapHub<OrderHub>("/orderHub");
app.MapHub<InvoiceHub>("/invoiceHub");

app.Run();