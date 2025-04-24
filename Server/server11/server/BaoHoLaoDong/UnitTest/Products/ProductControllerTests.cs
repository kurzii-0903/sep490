using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Services.Interface;
using ManagementAPI.Controllers;
using AutoMapper;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Mappings.ResponseDTO;
using System.Text;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using BusinessObject.Entities;
using Moq.Language.Flow;
namespace UnitTest.Products
{
    public class ProductControllerTests
    {
        private Mock<IProductService> _productServiceMock;
        private Mock<IBlogPostService> _blogPostServiceMock;
        private Mock<IHubContext<ProductHub>> _productHubMock;
        private Mock<IMapper> _mapperMock;
        private ProductController _productController;
        private Mock<IServiceProvider> _mockServiceProvider;


        [SetUp]
        public void SetUp()
        {
            _productServiceMock = new Mock<IProductService>();
            _blogPostServiceMock = new Mock<IBlogPostService>();
            _productHubMock = new Mock<IHubContext<ProductHub>>();
            _mapperMock = new Mock<IMapper>();
            _mockServiceProvider = new Mock<IServiceProvider>();

            _mockServiceProvider.Setup(sp => sp.GetService(typeof(IProductService)))
                                .Returns(_productServiceMock.Object);

            _productController = new ProductController(
                _productServiceMock.Object,
                _blogPostServiceMock.Object,
                _productHubMock.Object,
                _mapperMock.Object
            );
        }

        #region Product
        #region Create_Product
        [Test]
        public async Task CreateProduct_ValidName_ReturnsSuccess()
        {
            // Arrange
            var content = "Fake file content";
            var fileName = "test.jpg";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var formFile = new FormFile(stream, 0, stream.Length, "Files", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var newProduct = new NewProduct
            {
                Name = "Product1",
                Category = 1,
                Description = "Good product",
                Discount = 1,
                Price = 10.99m,
                Quantity = 5,
                Status = true,
                Files = new List<IFormFile> { formFile },
                ProductVariants = new List<NewProductVariant>
        {
            new NewProductVariant
            {
                Size = "M",
                Quantity = 10,
                Color = "Red",
                Price = 10.99m,
                Discount = 10,
                Status = true
            }
        }
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            // Validate the product object
            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task CreateProduct_InvalidQuantity_ReturnsBadRequest()
        {
            // Arrange
            var content = "Fake file content";
            var fileName = "test.jpg";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var formFile = new FormFile(stream, 0, stream.Length, "Files", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var newProduct = new NewProduct
            {
                Name = "Product Test",
                Category = 1,
                Description = "Test description",
                Discount = 10,
                Origin = "Vietnam",
                Price = 10.99m,
                Quantity = -5,
                Status = true,
                Files = new List<IFormFile> { formFile },
                ProductVariants = new List<NewProductVariant>
            {
                new NewProductVariant
                {
                    Size = "M",
                    Quantity = 10,
                    Color = "Red",
                    Price = 10.99m,
                    Discount = 10,
                    Status = true
                }
            }
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            var result = await _productController.CreateProduct(newProduct);

            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());
        }

        [Test]
        public async Task CreateProduct_InvalidDiscount_ReturnsBadRequest()
        {
            // Arrange
            var content = "Fake file content";
            var fileName = "test.jpg";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var formFile = new FormFile(stream, 0, stream.Length, "Files", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var newProduct = new NewProduct
            {
                Name = "Product Test",
                Category = 1,
                Description = "Test description",
                Discount = -1,
                Origin = "Vietnam",
                Price = 10.99m,
                Quantity = 5,
                Status = true,
                Files = new List<IFormFile> { formFile },
                ProductVariants = new List<NewProductVariant>
        {
            new NewProductVariant
            {
                Size = "M",
                Quantity = 10,
                Color = "Red",
                Price = 10.99m,
                Discount = 10,
                Status = true
            }
        }
            };

            // Add validation errors manually to ModelState
            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());

            var errorDetails = (SerializableError)badRequestResult.Value;
            Assert.That(errorDetails.ContainsKey("Discount"), Is.True, "Discount validation error should be present.");
        }

        [Test]
        public async Task CreateProduct_InvalidPrice_ReturnsBadRequest()
        {
            // Arrange
            var content = "Fake file content";
            var fileName = "test.jpg";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var formFile = new FormFile(stream, 0, stream.Length, "Files", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var newProduct = new NewProduct
            {
                Name = "Product Test",
                Category = 1,
                Description = "Test description",
                Discount = 10,
                Origin = "Vietnam",
                Price = -10,
                Quantity = 5,
                Status = true,
                Files = new List<IFormFile> { formFile },
                ProductVariants = new List<NewProductVariant>
        {
            new NewProductVariant
            {
                Size = "M",
                Quantity = 10,
                Color = "Red",
                Price = 10.99m,
                Discount = 10,
                Status = true
            }
        }
            };

            // Add validation errors manually to ModelState
            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());

            var errorDetails = (SerializableError)badRequestResult.Value;
            Assert.That(errorDetails.ContainsKey("Price"), Is.True, "Price validation error should be present.");
        }

        [Test]
        public async Task CreateProduct_InvalidName_ReturnsBadRequest()
        {
            // Arrange
            var content = "Fake file content";
            var fileName = "test.jpg";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            var formFile = new FormFile(stream, 0, stream.Length, "Files", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };

            var newProduct = new NewProduct
            {
                Name = "",
                Category = 1,
                Description = "Test description",
                Discount = 10,
                Price = 10.99m,
                Quantity = 5,
                Status = true,
                Files = new List<IFormFile> { formFile },
                ProductVariants = new List<NewProductVariant>
        {
            new NewProductVariant
            {
                Size = "M",
                Quantity = 10,
                Color = "Red",
                Price = 10.99m,
                Discount = 10,
                Status = true
            }
        }
            };

            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());

            var errorDetails = (SerializableError)badRequestResult.Value;
            Assert.That(errorDetails.ContainsKey("Name"), Is.True, "Name validation error should be present.");
        }

        [Test]
        public async Task CreateProduct_InvalidNameNull_ReturnsBadRequest()
        {
            // Arrange
            var newProduct = new NewProduct
            {
                Name = null,
                Category = 1,
                Description = "Good product",
                Discount = 1,
                Price = 10.99m,
                Quantity = 5,
                Status = true,
                Files = new List<IFormFile>(),
                ProductVariants = new List<NewProductVariant>()
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            // Validate the product object
            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());
        }

        [Test]
        public async Task CreateProduct_InvalidQuantityEmpty_ReturnsBadRequest()
        {
            // Arrange
            var newProduct = new NewProduct
            {
                Name = "Product1",
                Category = 1,
                Description = "Good product",
                Discount = 1,
                Price = 10.99m,
                //Quantity = "", 
                Status = true,
                Files = new List<IFormFile>(),
                ProductVariants = new List<NewProductVariant>()
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            _productController.ModelState.AddModelError("Quantity", "The value '' is not valid for Quantity.");

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());
        }

        [Test]
        public async Task CreateProduct_InvalidQuantityNull_ReturnsBadRequest()
        {
            // Arrange
            var newProduct = new NewProduct
            {
                Name = "Product1",
                Category = 1,
                Description = "Good product",
                Discount = 1,
                Price = 10.99m,
                Quantity = -1, // Giá trị hợp lệ ban đầu
                Status = true,
                Files = new List<IFormFile>(), // Giả lập các file nếu cần
                ProductVariants = new List<NewProductVariant>()
            };

            var quantityProperty = typeof(NewProduct).GetProperty("Quantity");
            //quantityProperty.SetValue(newProduct, null);  

            // Validate the product object
            var validationContext = new ValidationContext(newProduct, _mockServiceProvider.Object, null);
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(newProduct, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                }
            }

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            // Act
            var result = await _productController.CreateProduct(newProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequestResult = (BadRequestObjectResult)result;
            Assert.That(badRequestResult.Value, Is.TypeOf<SerializableError>());
        }
        #endregion Create_Product

        #region update_product 

        [Test]
        public async Task UpdateProduct_ValidRequest_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var updateProduct = new UpdateProduct
            {
                //Id = 1,
                Name = "Updated Product",
                CategoryId = 2,
                Quantity = 10,
                Price = 50.5m,
                Guarantee = 12,
                Status = true
            };

            var response = new ProductResponse
            {
                //Id = updateProduct.Id,
                Name = updateProduct.Name,
                CategoryId = updateProduct.CategoryId ?? 0,
                Quantity = updateProduct.Quantity,
                Price = updateProduct.Price,
                Guarantee = updateProduct.Guarantee,
                Status = updateProduct.Status
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            // Validate the updateProduct object manually
            var validationContext = new ValidationContext(updateProduct);
            var results = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(updateProduct, validationContext, results, true);

            if (!isValid)
            {
                foreach (var validationResult in results)
                {
                    foreach (var memberName in validationResult.MemberNames)
                    {
                        _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                    }
                }
            }

            if (isValid)
            {
                // Setup mock service and hub BEFORE calling controller
                _productServiceMock
                    .Setup(s => s.UpdateProductAsync(updateProduct))
                    .ReturnsAsync(response);

                mockClientProxy
                    .Setup(p => p.SendCoreAsync(
                        "ProductUpdated",
                        It.Is<object[]>(o => o.Length == 1 && o[0] == response),
                        default))
                    .Returns(Task.CompletedTask);
            }

            // Act
            var actionResult = await _productController.UpdateProduct(updateProduct);

            // Assert
            if (!isValid)
            {
                Assert.That(actionResult, Is.InstanceOf<BadRequestObjectResult>());
            }
            else
            {
                Assert.That(actionResult, Is.InstanceOf<OkObjectResult>());
                var okResult = (OkObjectResult)actionResult;
                Assert.That(okResult.Value, Is.EqualTo(response));

                mockClientProxy.Verify(p =>
                    p.SendCoreAsync(
                        "ProductUpdated",
                        It.Is<object[]>(o => o.Length == 1 && o[0] == response),
                        default),
                    Times.Once);
            }
        }

        [Test]
        public async Task UpdateProduct_InvalidModel_NoName_ReturnsBadRequest()
        {
            // Arrange
            var updateProduct = new UpdateProduct
            {
                Id = 1,
                //Name = "Updated Product",
                CategoryId = 2,
                Quantity = 10,
                Price = 50.5m,
                Guarantee = 12,
                Status = true
            };

            _productController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            var validationContext = new ValidationContext(updateProduct);
            var results = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(updateProduct, validationContext, results, true);

            if (!isValid)
            {
                foreach (var validationResult in results)
                {
                    foreach (var memberName in validationResult.MemberNames)
                    {
                        _productController.ModelState.AddModelError(memberName, validationResult.ErrorMessage);
                    }
                }
            }
            var result = await _productController.UpdateProduct(updateProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest, Is.Not.Null);

        }

        [Test]
        public async Task UpdateProduct_ValidModel_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var updateProduct = new UpdateProduct
            {
                Id = 1,
                Name = "Updated Product",
                CategoryId = 2,
                Quantity = 10,
                Price = 50.5m,
                Guarantee = 12,
                Status = true
            };

            var response = new ProductResponse
            {
                Id = updateProduct.Id,
                Name = updateProduct.Name,
                CategoryId = updateProduct.CategoryId ?? 0,
                Quantity = updateProduct.Quantity,
                Price = updateProduct.Price,
                Guarantee = updateProduct.Guarantee,
                Status = updateProduct.Status
            };

            var mockHubClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockHubClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockHubClients.Object);

            _productServiceMock
                .Setup(s => s.UpdateProductAsync(updateProduct))
                .ReturnsAsync(response);

            mockClientProxy
                .Setup(p => p.SendCoreAsync(
                    "ProductUpdated",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == response),
                    default))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _productController.UpdateProduct(updateProduct);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult?.Value, Is.EqualTo(response));

            mockClientProxy.Verify(p =>
                p.SendCoreAsync(
                    "ProductUpdated",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == response),
                    default),
                Times.Once);
        }


        #endregion update_product

        #endregion Product

        #region Product_Category

        #region Create

        [Test]
        public async Task CreateNewCategory_ValidData_ReturnsOkResult()
        {
            // Arrange
            var newCategory = new NewProductCategory
            {
                CategoryName = "Safety Equipment",
                Description = "Protective gear for workers",
                GroupId = 1
            };

            var expectedResult = new List<ProductCategoryGroupResponse>
            {
                new ProductCategoryGroupResponse
                {
                    GroupId = 1,
                    GroupName = "PPE",
                    Categories = new List<CategoryResponse>
                    {
                        new CategoryResponse
                        {
                            CategoryId = 1,
                            CategoryName = "Safety Equipment",
                            Description = "Protective gear for workers",
                            GroupId = 1
                        }
                    }
                }
            };

            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(hub => hub.Clients).Returns(mockClients.Object);

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ReturnsAsync(expectedResult);

            string? sentMethod = null;
            object? sentArg = null;

            mockClientProxy
                .Setup(client => client.SendCoreAsync(
                    It.IsAny<string>(),
                    It.IsAny<object[]>(),
                    It.IsAny<CancellationToken>()))
                .Callback<string, object[], CancellationToken>((method, args, token) =>
                {
                    sentMethod = method;
                    if (args.Length > 0)
                    {
                        sentArg = args[0];
                    }
                })
                .Returns(Task.CompletedTask);

            var result = await _productController.CreateNewCategory(newCategory);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult?.Value, Is.EqualTo(expectedResult));

            Assert.That(sentMethod, Is.EqualTo("ProductCategoryAdded"));
            Assert.That(sentArg, Is.EqualTo(expectedResult));
        }
        [Test]
        public async Task CreateNewCategory_ServiceReturnsNull_ReturnsBadRequest()
        {
            // Arrange
            var newCategory = new NewProductCategory
            {
                CategoryName = "Test",
                Description = "Test description",
                GroupId = 1
            };

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ReturnsAsync((List<ProductCategoryGroupResponse>?)null);

            // Act
            var result = await _productController.CreateNewCategory(newCategory);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult, Is.Not.Null);
        }
        [Test]
        public async Task CreateNewCategory_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            // Arrange
            var newCategory = new NewProductCategory
            {
                CategoryName = "Test",
                Description = "Description",
                GroupId = 999 
            };

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ThrowsAsync(new ArgumentException("GroupId does not exist"));

            // Act
            var result = await _productController.CreateNewCategory(newCategory);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest?.Value?.ToString(), Does.Contain("GroupId does not exist"));
        }
        [Test]
        public async Task CreateNewCategory_ServiceThrowsGeneralException_ReturnsBadRequest()
        {
            var newCategory = new NewProductCategory
            {
                CategoryName = "Test",
                Description = "Desc",
                GroupId = 1
            };

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _productController.CreateNewCategory(newCategory);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());

        }
        [Test]
        public async Task CreateNewCategory_MissingCategoryName_ReturnsBadRequest()
        {
            // Arrange
            var newCategory = new NewProductCategory
            {
                CategoryName = null,
                Description = "Some description",
                GroupId = 1
            };

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ReturnsAsync((List<ProductCategoryGroupResponse>?)null);

            // Act
            var result = await _productController.CreateNewCategory(newCategory);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());

        }
        [Test]
        public async Task CreateNewCategory_InvalidGroupId_ReturnsBadRequest()
        {
            // Arrange
            var newCategory = new NewProductCategory
            {
                CategoryName = "New Category",
                Description = "Some description",
                GroupId = 999 
            };

            _productServiceMock.Setup(s => s.CreateNewCategory(It.IsAny<NewProductCategory>()))
                .ThrowsAsync(new ArgumentException("Group ID does not exist"));

            // Act
            var result = await _productController.CreateNewCategory(newCategory);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest?.Value?.ToString(), Does.Contain("Group ID does not exist"));
        }


        #endregion Create

        #region Update

        [Test]
        public async Task UpdateCategory_ValidRequest_ReturnsOkWithResult()
        {
            // Arrange
            var updateRequest = new UpdateProductCategory
            {
                CategoryId = 1,
                CategoryName = "Găng tay",
                Description = "Bảo hộ tay",
                GroupId = 2
            };

            var expectedList = new List<ProductCategoryGroupResponse>
                {
                    new ProductCategoryGroupResponse
                    {
                        GroupId = 2,
                        GroupName = "Đồ bảo hộ",
                        Description = "Thiết bị bảo hộ lao động",
                        Categories = new List<CategoryResponse>
                        {
                            new CategoryResponse
                            {
                                CategoryId = 1,
                                CategoryName = "Găng tay",
                                Description = "Bảo hộ tay"
                            }
                        }
                    }
                };

            // Setup mock hub
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            _productHubMock.Setup(h => h.Clients).Returns(mockClients.Object);

            // Setup mock service
            _productServiceMock.Setup(s => s.UpdateCategoryAsync(It.IsAny<UpdateProductCategory>()))
                               .ReturnsAsync(expectedList);

            // Act
            var result = await _productController.UpdateCategory(updateRequest);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult!.Value, Is.EqualTo(expectedList));

            mockClientProxy.Verify(client => client.SendCoreAsync(
                "ProductCategoryUpdated",
                It.Is<object[]>(args => args[0] == expectedList),
                default
            ), Times.Once);
        }

        [Test]
        public async Task UpdateCategory_ServiceReturnsNull_ReturnsOkWithNull()
        {
            // Arrange
            var updateRequest = new UpdateProductCategory
            {
                CategoryId = 2,
                CategoryName = "Mũ bảo hộ",
                Description = "Bảo vệ đầu",
                GroupId = 1
            };

            _productServiceMock.Setup(s => s.UpdateCategoryAsync(It.IsAny<UpdateProductCategory>()))
                               .ReturnsAsync((List<ProductCategoryGroupResponse>?)null);

            // Act
            var result = await _productController.UpdateCategory(updateRequest);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult!.Value, Is.Null);
        }

        [Test]
        public async Task UpdateCategory_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var updateRequest = new UpdateProductCategory
            {
                CategoryId = 3,
                CategoryName = "Giày",
                Description = "Giày bảo hộ",
                GroupId = 3
            };

            _productServiceMock.Setup(s => s.UpdateCategoryAsync(It.IsAny<UpdateProductCategory>()))
                               .ThrowsAsync(new Exception("Service failed"));

            // Act
            var result = await _productController.UpdateCategory(updateRequest);

            // Assert
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest, Is.Not.Null);
            Assert.That(badRequest!.Value!.ToString(), Does.Contain("Service failed"));
        }


        #endregion Update


        #endregion Product_Category
    }

}

