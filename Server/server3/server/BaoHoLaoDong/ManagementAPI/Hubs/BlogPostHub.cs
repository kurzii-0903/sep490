using BusinessLogicLayer.Mappings.ResponseDTO;
using Microsoft.AspNetCore.SignalR;

namespace ManagementAPI.Hubs
{
    public class BlogPostHub : Hub
    {
        public async Task SendBlogAdded(BlogPostResponse blogPost)
        {
            await Clients.All.SendAsync("BlogAdded", blogPost);
        }

        public async Task SendBlogUpdated(BlogPostResponse blogPost)
        {
            await Clients.All.SendAsync("BlogUpdated", blogPost);
        }

        public async Task SendBlogDeleted(int blogPostId)
        {
            await Clients.All.SendAsync("BlogDeleted", blogPostId);
        }

        public async Task SendBlogCategoryAdded(BlogCategoryResponse categoryGroup)
        {
            await Clients.All.SendAsync("BlogCategoryAdded", categoryGroup);
        }

        public async Task SendBlogCategoryUpdated(BlogCategoryResponse categoryGroup)
        {
            await Clients.All.SendAsync("BlogCategoryUpdated", categoryGroup);
        }
    }
}
