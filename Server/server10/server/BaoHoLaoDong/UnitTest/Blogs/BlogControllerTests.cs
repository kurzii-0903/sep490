using BusinessLogicLayer.Mappings.RequestDTO;
using BusinessLogicLayer.Mappings.ResponseDTO;
using BusinessLogicLayer.Services.Interface;
using BusinessObject.Entities;
using ManagementAPI.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
namespace UnitTest.Blogs
{
    [TestFixture]
    public class BlogPostControllerTests
    {
        private Mock<IBlogPostService> _blogPostServiceMock;
        private BlogPostController _blogPostController;

        [SetUp]
        public void SetUp()
        {
            _blogPostServiceMock = new Mock<IBlogPostService>();
            _blogPostController = new BlogPostController(_blogPostServiceMock.Object);
        }
        #region Create_Blog
        [Test]
        public async Task CreateBlog_ShouldReturnOkResult_WhenBlogIsCreatedSuccessfully()
        {
            // Arrange
            var newBlogPost = new NewBlogPost
            {
                Title = "Test Blog",
                Content = "This is the content of the blog.",
                Summary = "This is a summary.",
                Tags = "tag1,tag2",
                Status = "Published",
                Category = 1,
                File = GetMockFormFile("sample.jpg", "image/jpeg")
            };

            var expectedResponse = new BlogPostResponse
            {
                PostId = 1,
                Title = newBlogPost.Title,
                Content = newBlogPost.Content,
                Summary = newBlogPost.Summary ?? "",
                Tags = newBlogPost.Tags ?? "",
                PostUrl = "test-blog-url",
                CategoryId = newBlogPost.Category,
                CategoryName = "Tech",
                CreatedAt = DateTime.UtcNow,
                ImageUrl = "/images/sample.jpg",
                Status = newBlogPost.Status
            };

            _blogPostServiceMock
                .Setup(service => service.CreateNewBlogPostAsync(It.IsAny<NewBlogPost>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _blogPostController.CreateBlog(newBlogPost);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult?.Value, Is.EqualTo(expectedResponse));
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenExceptionIsThrown()
        {
            // Arrange
            var newPost = new NewBlogPost
            {
                Title = "Fail Blog",
                Content = "Invalid content",
                Status = "Draft",
                Category = 1
            };

            _blogPostServiceMock.Setup(service => service.CreateNewBlogPostAsync(newPost))
                                .ThrowsAsync(new Exception("Something went wrong"));

            // Act
            var result = await _blogPostController.CreateBlog(newPost);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest?.Value, Is.EqualTo("Something went wrong"));
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenTitleIsMissing()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Title = null;

            _blogPostController.ModelState.AddModelError("Title", "Title is required");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenTitleExceedsMaxLength()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Title = new string('A', 256);

            _blogPostController.ModelState.AddModelError("Title", "Title cannot exceed 255 characters");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenContentIsMissing()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Content = null;

            _blogPostController.ModelState.AddModelError("Content", "Content is required");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());

        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenSummaryExceedsMaxLength()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Summary = new string('A', 501);

            _blogPostController.ModelState.AddModelError("Summary", "Summary cannot exceed 500 characters");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenStatusIsMissing()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Status = null;

            _blogPostController.ModelState.AddModelError("Status", "Status is required");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenCategoryIsZero()
        {
            var blogPost = GetValidBlogPost();
            blogPost.Category = 0;

            _blogPostController.ModelState.AddModelError("Category", "Category is required");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenFileIsTooLarge()
        {
            var blogPost = GetValidBlogPost();
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(6 * 1024 * 1024); // 6MB
            fileMock.Setup(f => f.FileName).Returns("demo.jpg");

            blogPost.File = fileMock.Object;

            _blogPostController.ModelState.AddModelError("File", "File size cannot exceed 5MB");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        [Test]
        public async Task CreateBlog_ShouldReturnBadRequest_WhenFileExtensionIsInvalid()
        {
            var blogPost = GetValidBlogPost();
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(1024);
            fileMock.Setup(f => f.FileName).Returns("demo.exe");

            blogPost.File = fileMock.Object;

            _blogPostController.ModelState.AddModelError("File", "Invalid file extension");

            var result = await _blogPostController.CreateBlog(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        #endregion Create_Blog
        #region Update_Blog

        [Test]
        public async Task UpdateBlog_ShouldReturnOkResult_WhenBlogIsUpdatedSuccessfully()
        {
            // Arrange
            var updateBlogPost = new UpdateBlogPost
            {
                Id = 1,
                Title = "Updated Blog Title",
                Content = "This is the updated content of the blog.",
                Summary = "Updated summary",
                Tags = "updatedTag1,updatedTag2",
                Status = "Published",
                Category = 1,
                File = GetMockFormFile("updatedImage.jpg", "image/jpeg")
            };

            var expectedResponse = new BlogPostResponse
            {
                PostId = 1,
                Title = updateBlogPost.Title,
                Content = updateBlogPost.Content,
                Summary = updateBlogPost.Summary ?? "",
                Tags = updateBlogPost.Tags ?? "",
                PostUrl = "updated-blog-url",
                CategoryId = updateBlogPost.Category,
                CategoryName = "Tech",
                CreatedAt = DateTime.UtcNow,
                ImageUrl = "/images/updatedImage.jpg",
                Status = updateBlogPost.Status
            };

            _blogPostServiceMock
                .Setup(service => service.UpdateBlogPostAsync(It.IsAny<UpdateBlogPost>()))
                .ReturnsAsync(expectedResponse);

            // Act
            var result = await _blogPostController.UpdateBlogPost(updateBlogPost);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult?.Value, Is.EqualTo(expectedResponse));
        }


        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenExceptionIsThrown()
        {
            // Arrange
            var updateBlogPost = new UpdateBlogPost
            {
                Id = 1,
                Title = "Fail Blog",
                Content = "Invalid content",
                Status = "Draft",
                Category = 1
            };

            _blogPostServiceMock.Setup(service => service.UpdateBlogPostAsync(updateBlogPost))
                                .ThrowsAsync(new Exception("Something went wrong"));

            // Act
            var result = await _blogPostController.UpdateBlogPost(updateBlogPost);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest?.Value, Is.EqualTo("Something went wrong"));
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenTitleIsMissing()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Title = null;

            _blogPostController.ModelState.AddModelError("Title", "Title is required");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenTitleExceedsMaxLength()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Title = new string('A', 256);

            _blogPostController.ModelState.AddModelError("Title", "Title cannot exceed 255 characters");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenContentIsMissing()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Content = null;

            _blogPostController.ModelState.AddModelError("Content", "Content is required");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenSummaryExceedsMaxLength()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Summary = new string('A', 501);

            _blogPostController.ModelState.AddModelError("Summary", "Summary cannot exceed 500 characters");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenStatusIsMissing()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Status = null;

            _blogPostController.ModelState.AddModelError("Status", "Status is required");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenCategoryIsZero()
        {
            var blogPost = GetValidUpdateBlogPost();
            blogPost.Category = 0;

            _blogPostController.ModelState.AddModelError("Category", "Category is required");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenFileIsTooLarge()
        {
            var blogPost = GetValidUpdateBlogPost();
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(6 * 1024 * 1024); // 6MB
            fileMock.Setup(f => f.FileName).Returns("demo.jpg");

            blogPost.File = fileMock.Object;

            _blogPostController.ModelState.AddModelError("File", "File size cannot exceed 5MB");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateBlog_ShouldReturnBadRequest_WhenFileExtensionIsInvalid()
        {
            var blogPost = GetValidUpdateBlogPost();
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(1024);
            fileMock.Setup(f => f.FileName).Returns("demo.exe");

            blogPost.File = fileMock.Object;

            _blogPostController.ModelState.AddModelError("File", "Invalid file extension");

            var result = await _blogPostController.UpdateBlogPost(blogPost);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
        #endregion Update_Blog
        #region code_test_file
        private IFormFile GetMockFormFile(string fileName)
        {
            var content = "fake image content";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            return new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
        }
        private IFormFile GetMockFormFile(string fileName, string contentType)
        {
            var content = "Fake image content";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
            return new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };
        }
        private UpdateBlogPost GetValidUpdateBlogPost()
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(1024); // 1KB
            fileMock.Setup(f => f.FileName).Returns("image.jpg");

            return new UpdateBlogPost
            {
                Id = 1, // Ensure you provide a valid Id for the blog post
                Title = "Updated Title Demo",
                Content = "Updated Content demo",
                Summary = "Updated Summary",
                Tags = "updatedTag1, updatedTag2",
                PostUrl = "https://updated-example.com",
                Status = "Published",
                Category = 1,
                File = fileMock.Object
            };
        }

        private NewBlogPost GetValidBlogPost()
        {
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(1024); // 1KB
            fileMock.Setup(f => f.FileName).Returns("image.jpg");

            return new NewBlogPost
            {
                Title = "Title Demo",
                Content = "Content demo",
                Summary = "Summary",
                Tags = "tag1, tag2",
                PostUrl = "https://example.com",
                Status = "Draft",
                Category = 1,
                File = fileMock.Object
            };
        }


        #endregion code_test_file

    }
}
