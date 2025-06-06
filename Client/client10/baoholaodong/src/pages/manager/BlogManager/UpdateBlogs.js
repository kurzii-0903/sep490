"use client"

import { useState, useEffect, useContext } from "react"
import {useNavigate, useParams} from "react-router-dom"
import axios from "axios"
import { FaImage, FaMarkdown, FaQuestionCircle } from "react-icons/fa"
import "./create-blog.css"
import { BlogPostContext } from "../../../contexts/BlogPostContext"
import {TextEditor} from "../../../components/TextEditor";
import type React from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL_API

export default function UpdateBlog() {
	const navigate = useNavigate()
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [status, setStatus] = useState("Draft")
	const [summary, setSummary] = useState("")
	const [tags, setTags] = useState("")
	const [category, setCategory] = useState(0)
	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState("")
	const [message, setMessage] = useState({ type: "", text: "" })
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { categories } = useContext(BlogPostContext)
	const { id } = useParams();
	const [post, setPost] = useState({
		id: 0,
		title: "",
		content: "",
		tags:"",
		summary: "",
		status: "draft",
		imageUrl: "",
		categoryId: 0,
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog/${id}`);
				setTitle(response.data.title)
				setContent(response.data.content)
				setStatus(response.data.status)
				setSummary(response.data.summary)
				setTags(response.data.tags)
				setCategory(response.data.categoryId);
			} catch (e) {
				console.error("Error fetching post data", e);
			}
		};
		if (id) {
			fetchData();
		}
	}, [id]);
	useEffect(()=>{
		if(post){
			setTitle(post.title)
			setContent(post.content)
			setStatus(post.status)
			setCategory(post.categoryId)
			if(post.imageUrl !== null){
				setPreviewUrl(post.imageUrl);
			}
		}
	},[post])
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0]
		if (selectedFile) {
			setFile(selectedFile)
			setPreviewUrl(URL.createObjectURL(selectedFile))
		}
	}

	const handleContentChange = (newContent) => {
		setContent(newContent)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if (!post.title || !post.content || !post.categoryId) {
		// 	alert("Please fill in all required fields!");
		// 	return;
		// }

		const formData = new FormData();
		formData.append("id", parseInt(id));
		formData.append("title", title);
		formData.append("content", content);
		formData.append("tags", tags);
		formData.append("summary", summary);
		formData.append("status", status);
		formData.append("category", category);
		formData.append("file", file);

		try {
			setIsSubmitting(true);
		    const response = await axios.put(`${BASE_URL}/api/BlogPost/update-blog`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setPost(response.data);
			alert("Bài viết đã được cập nhật thành công!");
		} catch (err) {
			console.error("Error updating post", err);
			alert("Đã xảy ra lỗi, vui lòng thử lại!");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	return (
		<div className="blog-editor-container">
			<div className="blog-editor-card">
				<div className="blog-editor-header">
					<h1 className="blog-editor-title">Cập nhật bài viết</h1>
				</div>

				{message.text && (
					<div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>{message.text}</div>
				)}

				<form>
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
								value={title}
								onChange={(e) => setTitle(e.target.value)}
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
								value={summary}
								onChange={(e) => setSummary(e.target.value)}
								maxLength={500}
								rows={3}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="content" className="form-label">
								Nội dung
							</label>
							<TextEditor width={"100%"} height={"300px"} maxLength={50000} value={content} setValue={setContent} />
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
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								maxLength={255}
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
										value={status}
										onChange={(e) => setStatus(e.target.value)}
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
										value={category}
										onChange={(e) => setCategory(Number.parseInt(e.target.value))}
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
											required
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
											<img src={previewUrl || "/placeholder.svg"} alt="Preview" className="file-preview-image" />
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
						<button onClick={(e)=>!isSubmitting? handleSubmit(e):()=>{return}} type="submit" className="btn btn-primary" disabled={isSubmitting}>
							{isSubmitting ? "Đang xử lý..." : "Cập nhât bài viết"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

