import React, { useContext, useState, useEffect } from "react";
import { BlogPostContext } from "../../../contexts/BlogPostContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import blogPosts from "./BlogPosts";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const Loading = ({ isLoading }) => {
	if (!isLoading) return null;
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
			<div className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-3">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span className="text-lg font-semibold">Saving post...</span>
			</div>
		</div>
	);
};

const UpdateBlogs = () => {
	const { categories } = useContext(BlogPostContext);
	const { id } = useParams();
	const [post, setPost] = useState({
		id: 0,
		title: "",
		content: "",
		status: "draft",
		imageUrl: "",
		categoryId: 0,
	});
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog/${id}`);
				setPost(response.data);
			} catch (e) {
				console.error("Error fetching post data", e);
			}
		};
		if (id) {
			fetchData();
		}
	}, [id]);

	const handleChange = (e) => {
		const { id, value } = e.target;
		setPost((prev) => ({ ...prev, [id]: value }));
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!post.title || !post.content || !post.categoryId) {
			alert("Please fill in all required fields!");
			return;
		}

		const formData = new FormData();
		formData.append("id", parseInt(id));
		formData.append("title", post.title);
		formData.append("content", post.content);
		formData.append("status", post.status);
		formData.append("category", post.categoryId);
		formData.append("file", file);

		try {
			setIsLoading(true);
			await axios.put(`${BASE_URL}/api/BlogPost/update-blog`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			alert("Bài viết đã được cập nhật thành công!");
		} catch (err) {
			console.error("Error updating post", err);
			alert("Đã xảy ra lỗi, vui lòng thử lại!");
		} finally {
			setIsLoading(false);
		}
	};
	const handleDelete = (e) => {
		e.preventDefault();

	}
	return (
		<div className="w-full min-h-screen p-10 bg-gray-100 flex justify-center items-center">
			<Loading isLoading={isLoading} />
			<div className="w-full max-w-5xl bg-white p-10 rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold mb-6 text-center">Update Blog Post</h2>
				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
					<div className="col-span-2">
						<label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Title</label>
						<input className="w-full p-3 border rounded-lg" id="title" type="text" value={post.title} onChange={handleChange} required />
					</div>

					<div className="col-span-2">
						<label className="block text-gray-700 font-semibold mb-2" htmlFor="content">Content</label>
						<textarea className="w-full p-3 border rounded-lg" id="content" rows="6" value={post.content} onChange={handleChange} required />
					</div>

					<div className="col-span-2">
						<label className="block text-gray-700 font-semibold mb-2" htmlFor="status">Status</label>
						<select id="status" value={post.status} onChange={handleChange} className="w-full p-3 border rounded-lg">
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					<div className="col-span-2">
						<label className="block text-gray-700 font-semibold mb-2" htmlFor="categoryId">Category</label>
						<select id="categoryId" value={post.categoryId} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
							<option value="">-- Select a Category --</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>{category.name}</option>
							))}
						</select>
					</div>

					<div className="col-span-2">
						<label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
						<input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-lg" accept="image/*" />
						{file ? (
							<div className="mt-3">
								<img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
							</div>
						):(
							<div className="mt-3">
								<img src={post.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
							</div>
						)}
					</div>

					<div className="col-span-2 text-center">
						<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateBlogs;