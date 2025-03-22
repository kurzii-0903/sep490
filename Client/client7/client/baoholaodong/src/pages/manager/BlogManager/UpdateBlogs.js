"use client"

import { useState, useEffect, useContext } from "react"
import {useNavigate, useParams} from "react-router-dom"
import axios from "axios"
import { FaImage, FaMarkdown, FaQuestionCircle } from "react-icons/fa"
import { Markdown, MarkdownToolbar, MarkdownHelp } from "../../../components/Markdown/markdown-editor"
import "./create-blog.css"
import { BlogPostContext } from "../../../contexts/BlogPostContext"

const BASE_URL = process.env.REACT_APP_BASE_URL_API

export default function UpdateBlog() {
	const navigate = useNavigate()
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [status, setStatus] = useState("Draft")
	const [category, setCategory] = useState(0)
	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState("")
	const [message, setMessage] = useState({ type: "", text: "" })
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [activeTab, setActiveTab] = useState("edit")
	const [showHelp, setShowHelp] = useState(false)
	const { categories } = useContext(BlogPostContext)
	const { id } = useParams();
	const [post, setPost] = useState({
		id: 0,
		title: "",
		content: "",
		status: "draft",
		imageUrl: "",
		categoryId: 0,
	});
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
		if (!post.title || !post.content || !post.categoryId) {
			alert("Please fill in all required fields!");
			return;
		}

		const formData = new FormData();
		formData.append("id", parseInt(id));
		formData.append("title", title);
		formData.append("content", content);
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
							<label htmlFor="content" className="form-label">
								Nội dung
								<button
									type="button"
									className="markdown-toolbar-button"
									style={{ marginLeft: "0.5rem" }}
									onClick={() => setShowHelp(!showHelp)}
									title={showHelp ? "Ẩn hướng dẫn" : "Hiện hướng dẫn"}
								>
									<FaQuestionCircle />
								</button>
							</label>

							{showHelp && <MarkdownHelp />}

							<div className="tabs">
								<div className="tabs-list">
									<div
										className={`tab-trigger ${activeTab === "edit" ? "active" : ""}`}
										onClick={() => setActiveTab("edit")}
									>
										<FaMarkdown style={{ display: "inline", marginRight: "6px" }} />
										Soạn thảo
									</div>
									<div
										className={`tab-trigger ${activeTab === "preview" ? "active" : ""}`}
										onClick={() => setActiveTab("preview")}
									>
										Xem trước
									</div>
								</div>

								<div className={`tab-content ${activeTab === "edit" ? "active" : ""}`}>
									<MarkdownToolbar textareaId="content" onContentChange={handleContentChange} />
									<textarea
										id="content"
										className="form-input form-textarea"
										placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)"
										value={content}
										onChange={(e) => setContent(e.target.value)}
										required
									/>
								</div>

								<div className={`tab-content ${activeTab === "preview" ? "active" : ""}`}>
									<div className="markdown-preview">
										{content ? (
											<Markdown content={content} />
										) : (
											<div className="markdown-preview-empty">Chưa có nội dung để hiển thị</div>
										)}
									</div>
								</div>
							</div>
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

