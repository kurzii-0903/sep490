using AutoMapper;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessObject.Entities;
using Microsoft.IdentityModel.Tokens;

namespace BusinessLogicLayer.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile(string applicationUrl)
        {
            // Ánh xạ từ Employee sang EmployeeRequest
            CreateMap<Employee, EmployeeResponse>()
                .ForMember(dest => dest.Gender, opt =>
                    opt.MapFrom(src =>
                        src.Gender.HasValue
                            ? (src.Gender.Value ? "Male" : "Female")
                            : "Undefined")); // Nếu null thì trả về null
            // Ánh xạ từ newEmployee sang Employee
            CreateMap<NewEmployee, Employee>()
                .ForMember(dest => dest.EmployeeId, opt => opt.Ignore()) // ID tự sinh
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PasswordHash,
                    opt => opt.MapFrom(src =>
                        BCrypt.Net.BCrypt.HashPassword(src.Password))) // Chuyển đổi Password → PasswordHash
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src=> 2))
                .ForMember(dest => dest.CreateAt,
                    opt => opt.MapFrom(_ => DateTime.UtcNow)) // Mặc định là thời gian hiện tại
                .ForMember(dest => dest.UpdateAt, opt => opt.Ignore()) // Bỏ qua UpdateAt khi tạo mới
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => "Active")) // Gán mặc định "Active"
                .ForMember(dest => dest.Notifications, opt => opt.Ignore()); // Bỏ qua danh sách thông báo
            // mapping fromg newcustomer => customer
            CreateMap<NewCustomer, Customer>()
                .ForMember(dest => dest.CustomerId, opt => opt.Ignore()) // ID tự sinh
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PasswordHash,
                    opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password))) // Hash password nếu cần
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.IsEmailVerified))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow)) // Mặc định ngày tạo
                .ForMember(dest => dest.UpdateAt, opt => opt.Ignore()) // Không cập nhật ban đầu
                .ForMember(dest => dest.AccountVerifications,
                    opt => opt.Ignore()) // Bỏ qua danh sách xác thực tài khoản
                .ForMember(dest => dest.Orders, opt => opt.Ignore()) // Bỏ qua danh sách đơn hàng
                .ForMember(dest => dest.ProductReviews, opt => opt.Ignore()); // Bỏ qua danh sách đánh giá sản phẩm
            CreateMap<Customer, CustomerResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.CustomerId));
            CreateMap<Customer, UserResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.Name, otp => otp.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, otp => otp.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, otp => otp.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, otp => otp.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, otp => otp.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.RoleName, otp => otp.MapFrom(src => "Customer"))
                .ForMember(dest => dest.ImageUrl, otp => otp.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.IsEmailVerified, otp => otp.MapFrom(src => src.IsEmailVerified))
                .ForMember(dest => dest.CreatedAt, otp => otp.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdateAt, otp => otp.MapFrom(src => src.UpdateAt))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => "Active"));
            CreateMap<Employee, UserResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.EmployeeId))
                .ForMember(dest => dest.Name, otp => otp.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, otp => otp.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, otp => otp.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, otp => otp.MapFrom(src => src.Address))
                .ForMember(dest => dest.DateOfBirth, otp => otp.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.RoleId, otp => otp.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.RoleName, otp => otp.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.ImageUrl, otp => otp.MapFrom(src => ""))
                .ForMember(dest => dest.IsEmailVerified, otp => otp.MapFrom(src => true))
                .ForMember(dest => dest.UpdateAt, otp => otp.MapFrom(src => src.UpdateAt))
                .ForMember(dest => dest.CreatedAt, otp => otp.MapFrom(src => src.CreateAt))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => src.Status));
            CreateMap<UpdateEmployee, Employee>()
                .ForMember(dest => dest.EmployeeId, otp => otp.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, otp => otp.MapFrom((src => src.Name)))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status)) // Chuyển Enum thành string
                .ForMember(dest => dest.UpdateAt,
                    opt => opt.MapFrom(_ => DateTime.UtcNow)) // Cập nhật thời gian chỉnh sửa
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Không map mật khẩu
                .ForMember(dest => dest.CreateAt, opt => opt.Ignore()) // Giữ nguyên CreateAt trong DB
                .ForMember(dest => dest.Notifications, opt => opt.Ignore()); // Bỏ qua danh sách Notifications
            CreateMap<NewProductCategory, ProductCategory>()
                .ForMember(dest => dest.CategoryName, otp => otp.MapFrom(src => src.CategoryName))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.GroupId, otp => otp.MapFrom(src => src.GroupId));
            CreateMap<ProductCategory, CategoryResponse>()
                .ForMember(dest => dest.CategoryId, otp => otp.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.CategoryName, otp => otp.MapFrom(src => src.CategoryName))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.GroupId, otp => otp.MapFrom(src => src.GroupId));
            CreateMap<UpdateProductCategory, ProductCategory>()
                .ForMember(dest => dest.CategoryId, otp => otp.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.CategoryName, otp => otp.MapFrom(src => src.CategoryName))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.GroupId, otp => otp.MapFrom(src => src.GroupId));
            CreateMap<NewProductVariant, ProductVariant>()
                .ForMember(dest => dest.VariantId,
                    opt => opt.Ignore()) // Ignore VariantId, as it will be auto-generated
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow)) // Set CreatedAt
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Optional, will remain null
                .ForMember(dest => dest.Product, opt => opt.Ignore()); // Ignore navigation property
            CreateMap<NewProduct, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Material, opt => opt.MapFrom(src => src.Material))
                .ForMember(dest => dest.Origin, opt => opt.MapFrom(src => src.Origin))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Discount))
                .ForMember(dest => dest.FreeShip, otp => otp.MapFrom((src => src.FreeShip)))
                .ForMember(dest => dest.Guarantee, otp => otp.MapFrom((src => src.Guarantee)))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.QualityCertificate, opt => opt.MapFrom(src => src.QualityCertificate))
                .ForMember(dest => dest.ProductVariants, opt => opt.MapFrom(src => src.ProductVariants))
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<Product, ProductResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Name, otp => otp.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.Slug, otp => otp.MapFrom(src => src.Slug))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.Material, otp => otp.MapFrom(src => src.Material))
                .ForMember(dest => dest.Origin, otp => otp.MapFrom(src => src.Origin))
                .ForMember(dest => dest.CategoryId, otp => otp.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.CategoryName,
                    otp => otp.MapFrom(src => src.Category != null ? src.Category.CategoryName : string.Empty))
                .ForMember(dest => dest.Quantity, otp => otp.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Price, otp => otp.MapFrom(src => src.Price))
                .ForMember(dest => dest.TotalSale, otp => otp.MapFrom(src => src.TotalSale))
                .ForMember(dest => dest.FreeShip, otp => otp.MapFrom(src => src.FreeShip))
                .ForMember(dest => dest.Guarantee, otp => otp.MapFrom(src => src.Guarantee))
                .ForMember(dest => dest.Discount, otp => otp.MapFrom(src => (src.Discount)))
                .ForMember(dest => dest.AverageRating,
                    otp => otp.MapFrom(src =>
                        src.AverageRating.HasValue ? (int)Math.Round(src.AverageRating.Value) : 0))
                .ForMember(dest => dest.QualityCertificate, otp => otp.MapFrom(src => src.QualityCertificate))
                .ForMember(dest => dest.CreatedAt, otp => otp.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, otp => otp.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => src.Status))
                .ForMember(dest => dest.TotalTax, otp => otp.MapFrom(src => src.TotalTax))
                .ForMember(dest => dest.Image,
                    otp => otp.MapFrom(src =>
                        (!src.ProductImages.IsNullOrEmpty())
                            ? ($"{applicationUrl}/images/products/{src.ProductImages.FirstOrDefault().FileName}")
                            : ""))
                .ForMember(dest => dest.ProductImages, otp => otp.MapFrom(src => src.ProductImages))
                .ForMember(dest => dest.ProductVariants, otp => otp.MapFrom(src => src.ProductVariants))
                .ForMember(dest => dest.Taxes, otp => otp.MapFrom(src => src.ProductTaxes))
                .ReverseMap();

            CreateMap<ProductVariant, ProductVariantResponse>();
            CreateMap<ProductImage, ProductImageResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.ProductImageId))
                .ForMember(dest => dest.Image,
                    otp => otp.MapFrom(src => $"{applicationUrl}/images/products/{src.FileName}"));
            CreateMap<UpdateProduct, Product>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Material, opt => opt.MapFrom(src => src.Material))
                .ForMember(dest => dest.Origin, opt => opt.MapFrom(src => src.Origin))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.FreeShip, otp => otp.MapFrom((src => src.FreeShip)))
                .ForMember(dest => dest.Guarantee, otp => otp.MapFrom((src => src.Guarantee)))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Discount))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.QualityCertificate, opt => opt.MapFrom(src => src.QualityCertificate))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<UpdateProductVariant, ProductVariant>();
            CreateMap<NewBlogPost, BlogPost>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, otp => otp.MapFrom(src => src.Content))
                .ForMember(dest => dest.Status, otp => otp.MapFrom((src => src.Status)))
                .ForMember(dest => dest.CategoryBlogId, otp => otp.MapFrom(src => src.Category));
            CreateMap<BlogPost, BlogPostResponse>()
                .ForMember(dest => dest.CategoryId, otp => otp.MapFrom(src => src.CategoryBlogId))
                .ForMember(dest => dest.CategoryName,
                    otp => otp.MapFrom(src => src.CategoryBlog != null ? src.CategoryBlog.CategoryName : null))
                .ForMember(dest => dest.Title, otp => otp.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, otp => otp.MapFrom(src => src.Content))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => src.Status))
                .ForMember(dest => dest.ImageUrl,
                    otp => otp.MapFrom(src =>
                        src.FileName != null ? $"{applicationUrl}/images/blogs/{src.FileName}" : null));
            CreateMap<UpdateBlogPost, BlogPost>()
                .ForMember(dest => dest.PostId, otp => otp.MapFrom(src => src.Id))
                .ForMember(dest => dest.CategoryBlogId, otp => otp.MapFrom(src => src.Category))
                .ForMember(dest => dest.Title, otp => otp.MapFrom(src => src.Title))
                .ForMember(dest=>dest.Summary,otp=>otp.MapFrom(src=>src.Summary))
                .ForMember(dest=>dest.Tags, otp => otp.MapFrom(src => src.Tags))
                .ForMember(dest => dest.Content, otp => otp.MapFrom(src => src.Content))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => src.Status))
                .ForMember(dest => dest.FileName, opt => opt.Ignore())
                .ReverseMap();

            CreateMap<NewBlogCategory, BlogCategory>()
                .ForMember(d => d.CategoryName, otp => otp.MapFrom(s => s.Name))
                .ForMember(d => d.Description, otp => otp.MapFrom(s => s.Description));
            CreateMap<UpdateBlogCategory, BlogCategory>()
                .ForMember(d => d.CategoryBlogId, otp => otp.MapFrom(s => s.Id))
                .ForMember(d => d.CategoryName, otp => otp.MapFrom(s => s.Name))
                .ForMember(d => d.Description, otp => otp.MapFrom(s => s.Description));
            CreateMap<BlogCategory, BlogCategoryResponse>()
                .ForMember(d => d.Id, otp => otp.MapFrom(s => s.CategoryBlogId))
                .ForMember(d => d.Name, otp => otp.MapFrom(s => s.CategoryName));

            //Order
            CreateMap<Order, OrderResponse>()
                .ForMember(dest => dest.CustomerId,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.CustomerId : (int?)null))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.CustomerName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.CustomerEmail))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.CustomerPhone))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.CustomerAddress))
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.CreatedAt : (DateTime?)null))
                .ForMember(dest => dest.UpdateAt,
                    opt => opt.MapFrom(src => src.Customer != null ? src.Customer.UpdateAt : (DateTime?)null))
                .ForMember(dest => dest.Invoice, otp => otp.MapFrom(src => src.Invoice));

            CreateMap<OrderDetail, OrderDetailResponse>()
              .ForMember(dest => dest.ProductImage,
                  otp => otp.MapFrom(src =>
                      (src.Product != null && src.Product.ProductImages != null && src.Product.ProductImages.Any())
                          ? $"{applicationUrl}/images/products/{src.Product.ProductImages.First().FileName}"
                          : string.Empty
                  ));
            CreateMap<Invoice, InvoiceResponse>()
                .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.InvoiceId))
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.InvoiceNumber))
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod))
                .ForMember(dest => dest.QrcodeData, opt => opt.MapFrom(src => src.QrcodeData))
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus))
                .ForMember(dest=>dest.ImageScreenTransfer,otp=>otp.MapFrom(src=> $"{applicationUrl}/images/bills/{src.FileName}"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.PaymentDate))
                .ForMember(dest => dest.PaymentConfirmOfCustomer,opt => opt.MapFrom(src => src.PaymentConfirmOfCustomer))
                .ForMember(dest => dest.Order, opt => opt.Ignore());

            CreateMap<NewOrder, Order>()
                .ForMember(dest => dest.Customer, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDetails, otp => otp.MapFrom(src => src.OrderDetails))
                .ForMember(dest => dest.CustomerAddress, otp => otp.MapFrom(src => src.CustomerAddress));
            CreateMap<Order, NewOrder>();

            CreateMap<Tax, TaxResponse>()
                .ForMember(dest => dest.TaxId, otp => otp.MapFrom(src => src.TaxId))
                .ForMember(dest => dest.TaxName, otp => otp.MapFrom(src => src.TaxName))
                .ForMember(dest => dest.TaxRate, otp => otp.MapFrom(src => src.TaxRate))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ReverseMap();
            CreateMap<NewProductTax, ProductTaxis>()
                .ForMember(dest => dest.ProductId, otp => otp.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.TaxId, otp => otp.MapFrom(src => src.TaxId));
            CreateMap<ProductTaxis, ProductTaxResponse>()
                .ForMember(dest => dest.ProductTaxId, otp => otp.MapFrom(src => src.ProductTaxId))
                .ForMember(dest => dest.ProductId, otp => otp.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.TaxId, otp => otp.MapFrom(src => src.TaxId))
                .ForMember(dest => dest.TaxName, otp => otp.MapFrom(src => src.Tax.TaxName))
                .ForMember(dest => dest.TaxRate, otp => otp.MapFrom(src => src.Tax.TaxRate))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Tax.Description))
                .ReverseMap();
            CreateMap<ProductCategoryGroup, ProductCategoryGroupResponse>()
                .ForMember(dest => dest.GroupId, otp => otp.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.GroupName, otp => otp.MapFrom(src => src.GroupName))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.Categories, otp => otp.MapFrom(src => src.ProductCategories))
                .ReverseMap();
            CreateMap<Notification, NotificationResponse>()
                .ForMember(dest => dest.Id, otp => otp.MapFrom(src => src.NotificationId))
                .ForMember(dest => dest.Title, otp => otp.MapFrom(src => src.Title))
                .ForMember(dest => dest.RecipientId, otp => otp.MapFrom(src => src.RecipientId))
                .ForMember(dest => dest.RecipientType, otp => otp.MapFrom(src => src.RecipientType))
                .ForMember(dest => dest.IsRead, otp => otp.MapFrom(src => src.IsRead))
                .ForMember(dest=>dest.OrderId,otp=>otp.MapFrom(src=>src.OrderId))
                .ForMember(dest => dest.CreatedAt, otp => otp.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, otp => otp.MapFrom(src => src.UpdatedAt))
                .ReverseMap();
            CreateMap<NewNotification, Notification>()
                .ForMember(dest => dest.Title, otp => otp.MapFrom(src => src.Title))
                .ForMember(dest => dest.RecipientId, otp => otp.MapFrom(src => src.RecipientId))
                .ForMember(dest => dest.RecipientType, otp => otp.MapFrom(src => src.RecipientType))
                .ReverseMap();
            CreateMap<NewGroupCategory, ProductCategoryGroup>()
                .ForMember(dest => dest.GroupName, otp => otp.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description));
            CreateMap<UpdateGroupCategory, ProductCategoryGroup>()
                .ForMember(dest => dest.GroupId, otp => otp.MapFrom(src => src.Id))
                .ForMember(dest => dest.GroupName, otp => otp.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.ProductCategories, otp => otp.Ignore())
                .ReverseMap();

            CreateMap<ProductReview, ProductReviewResponse>()
                .ForMember(dest => dest.ReviewId, opt => opt.MapFrom(src => src.ReviewId))
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.CustomerName, otp => otp.MapFrom(src => src.Customer.FullName))
                .ForMember(dest => dest.CustomerImage, otp => otp.MapFrom(src => src.Customer.ImageUrl));
            CreateMap<NewTax, Tax>()
                .ForMember(dest => dest.TaxName, otp => otp.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.TaxRate, otp => otp.MapFrom(src => src.Rate));
            CreateMap<UpdateTax, Tax>()
                .ForMember(dest => dest.TaxId, otp => otp.MapFrom(src => src.Id))
                .ForMember(dest => dest.TaxName, otp => otp.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, otp => otp.MapFrom(src => src.Description))
                .ForMember(dest => dest.TaxRate, otp => otp.MapFrom(src => src.Rate))
                .ReverseMap();

            CreateMap<OrderDetail, OrderPaymentResponseDetails>();
            CreateMap<OrderPaymentResponseDetails, OrderDetail>();

            CreateMap<NewOrderDetail, OrderDetail>()
                .ForMember(dest => dest.ProductId, otp => otp.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity, otp => otp.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.VariantId, otp => otp.MapFrom(src => src.VariantId.HasValue ? src.VariantId.Value : (int?)null));

        }
    }
}