"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaImage } from "react-icons/fa";
import "./create-blog.css";
import { BlogPostContext } from "../../../contexts/BlogPostContext";
import { TextEditor } from "../../../components/TextEditor";
import axiosInstance, { setAxiosInstance } from "../../../axiosInstance";
import { AuthContext } from "../../../contexts/AuthContext";

export default function UpdateBlog() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { categories } = useContext(BlogPostContext);
	const { user } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		summary: "",
		tags: "",
		status: "Draft",
		category: 0,
		postUrl: "",
	});
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [message, setMessage] = useState({ type: "", text: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (user && user.token) {
			setAxiosInstance(user.token);
		}
	}, [user]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/BlogPost/get-blog/${id}`);
				let cleanContent = response.data.content;
				if (cleanContent.includes("Nhập thẻ, phân cách bằng dấu phẩy")) {
					cleanContent = "";
				}
				setFormData({
					title: response.data.title,
					content: cleanContent,
					summary: response.data.summary,
					tags: response.data.tags,
					status: response.data.status,
					category: response.data.categoryId,
					postUrl: response.data.postUrl || "",
				});
				if (response.data.imageUrl) {
					setPreviewUrl(response.data.imageUrl);
				}
			} catch (e) {
				console.error("Error fetching post data", e);
				setMessage({ type: "error", text: "Không thể tải dữ liệu bài viết!" });
			}
		};
		if (id) {
			fetchData();
		}
	}, [id]);

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleContentChange = (value) => {
		setFormData((prev) => ({ ...prev, content: value }));
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { title, content, category } = formData;
		if (!title || !content || !category) {
			setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
			return;
		}

		setIsSubmitting(true);
		const data = new FormData();
		data.append("id", parseInt(id));
		Object.keys(formData).forEach((key) => data.append(key, formData[key]));
		if (file) {
			data.append("file", file);
		}

		try {
			await axiosInstance.put(`/api/BlogPost/update-blog`, data, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setMessage({ type: "success", text: "Bài viết đã được cập nhật thành công!" });
			setTimeout(() => navigate("/manager/blog-posts"), 1500);
		} catch (err) {
			console.error("Error updating post", err);
			setMessage({ type: "error", text: "Đã xảy ra lỗi, vui lòng thử lại!" });
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	return (
		<div className="blog-editor-container">
			<div className="blog-editor-card">
				<div className="blog-editor-header">
					<h1 className="blog-editor-title">Cập nhật bài viết</h1>
				</div>

				{message.text && (
					<div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
						{message.text}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="blog-editor-content">
						<div className="form-group">
							<label htmlFor="title" className="form-label">
								Tiêu đề bài viết
							</label>
							<input
								type="text"
								id="title"
								className="form-input"
								placeholder="Nhập tiêu đề bài viết"
								value={formData.title}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="summary" className="form-label">
								Tóm tắt
							</label>
							<textarea
								id="summary"
								className="form-input"
								placeholder="Nhập tóm tắt bài viết (tối đa 500 ký tự)"
								value={formData.summary}
								onChange={handleInputChange}
								maxLength={500}
								rows={3}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="content" className="form-label">
								Nội dung
							</label>
							<div className="text-editor-wrapper">
								<TextEditor
									width="100%"
									height="300px"
									maxLength={50000}
									value={formData.content}
									setValue={handleContentChange}
								/>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="tags" className="form-label">
								Thẻ
							</label>
							<input
								type="text"
								id="tags"
								className="form-input"
								placeholder="Nhập thẻ, phân cách bằng dấu phẩy (ví dụ: tin tức, sự kiện)"
								value={formData.tags}
								onChange={handleInputChange}
								maxLength={255}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="postUrl" className="form-label">
								URL bài viết
							</label>
							<input
								type="url"
								id="postUrl"
								className="form-input"
								placeholder="Nhập URL bài viết (ví dụ: https://example.com)"
								value={formData.postUrl}
								onChange={handleInputChange}
							/>
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label htmlFor="status" className="form-label">
										Trạng thái
									</label>
									<select
										id="status"
										className="form-input form-select"
										value={formData.status}
										onChange={handleInputChange}
									>
										<option value="Draft">Bản nháp</option>
										<option value="Published">Công khai</option>
									</select>
								</div>
							</div>

							<div className="form-col">
								<div className="form-group">
									<label htmlFor="category" className="form-label">
										Danh mục
									</label>
									<select
										id="category"
										className="form-input form-select"
										value={formData.category}
										onChange={(e) => setFormData((prev) => ({
											...prev,
											category: Number.parseInt(e.target.value),
										}))}
										required
									>
										<option value={0}>Chọn danh mục</option>
										{categories.length > 0 ? (
											categories.map(({ id, name }) => (
												<option key={id} value={id}>
													{name}
												</option>
											))
										) : (
											<option disabled>Không có danh mục nào</option>
										)}
									</select>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="thumbnail" className="form-label">
								Ảnh
							</label>
							<div className="form-row">
								<div className="form-col">
									<div className="file-upload-container">
										<input
											type="file"
											id="thumbnail"
											accept="image/*"
											onChange={handleFileChange}
											style={{ display: "none" }}
										/>
										<label htmlFor="thumbnail" style={{ cursor: "pointer", display: "block" }}>
											<FaImage className="file-upload-icon" />
											<p className="file-upload-text">Kéo thả hoặc nhấp để tải lên</p>
											<p className="file-upload-hint">SVG, PNG, JPG hoặc GIF (tối đa 2MB)</p>
										</label>
									</div>
								</div>
								{previewUrl && (
									<div className="form-col">
										<div className="file-preview-container">
											<p className="form-label">Ảnh xem trước:</p>
											<img
												src={previewUrl}
												alt="Preview"
												className="file-preview-image"
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="blog-editor-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => navigate("/manager/blog-posts")}
							disabled={isSubmitting}
						>
							Hủy
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Đang xử lý..." : "Cập nhật bài viết"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}