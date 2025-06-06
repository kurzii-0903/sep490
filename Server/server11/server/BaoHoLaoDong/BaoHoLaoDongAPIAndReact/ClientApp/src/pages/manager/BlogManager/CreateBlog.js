﻿"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaImage } from "react-icons/fa";
import "./create-blog.css";
import { BlogPostContext } from "../../../contexts/BlogPostContext";
import { TextEditor } from "../../../components/TextEditor";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { categories, refreshBlogPosts } = useContext(BlogPostContext);
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

  const handleCreate = async (e) => {
    e.preventDefault();

    const { title, content, category } = formData;
    if (!title || !content || !category || !file) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("file", file);

    try {
      await axios.post(`/api/BlogPost/create-blog`, data);
      setMessage({ type: "success", text: "Bài viết đã được tạo thành công!" });
      await refreshBlogPosts(true); // Làm mới danh sách, đặt lại bộ lọc về "All"
      setTimeout(() => navigate("/manager/blog-posts"), 1500);
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      setMessage({ type: "error", text: "Không thể tạo bài viết!" });
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
            <h1 className="blog-editor-title">Tạo bài viết mới</h1>
          </div>

          {message.text && (
              <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
                {message.text}
              </div>
          )}

          <form onSubmit={handleCreate}>
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
                      value={formData.content}
                      setValue={handleContentChange}
                      maxLength={2000}
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
                  Ảnh đại diện
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
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Tạo bài viết"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}