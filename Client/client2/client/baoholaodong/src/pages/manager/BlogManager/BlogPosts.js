import React from 'react';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';

const BlogPosts = () => {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b flex justify-between items-center">
					<h3 className="text-lg font-semibold text-gray-800">Blog Posts Management</h3>
					<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
						<Plus className="w-5 h-5 mr-2" />
						Create New Post
					</button>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[1, 2, 3, 4].map((post) => (
							<div key={post} className="bg-white border rounded-lg overflow-hidden">
								<img
									src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
									alt="Blog post"
									className="w-full h-48 object-cover"
								/>
								<div className="p-4">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="text-lg font-semibold text-gray-800">Blog Post Title</h4>
											<p className="text-gray-600 text-sm mt-1">Published on March 10, 2024</p>
										</div>
										<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
									</div>
									<p className="text-gray-600 mt-2 line-clamp-2">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									</p>
									<div className="flex justify-end space-x-2 mt-4">
										<button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
											<Edit className="w-5 h-5" />
										</button>
										<button className="p-2 text-red-600 hover:bg-red-50 rounded">
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogPosts;