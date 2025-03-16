import React, { useState, useContext, useEffect } from "react";
import { BlogPostContext } from "../../../contexts/BlogPostContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const CreateBlogs = () => {
  const navigate = useNavigate();
  const { categories } = useContext(BlogPostContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [category, setCategory] = useState(0);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    console.log("Categories:", categories);
  }, [categories]);

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Tạo URL xem trước
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !content || !category || !file) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("file", file);

    try {
      await axios.post(`${BASE_URL}/api/BlogPost/create-blog`, formData);
      alert("Bài viết đã được tạo thành công!");
      window.location.href=("/manager/blog-posts");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      setMessage({ type: "error", text: "Không thể tạo bài viết!" });
    }
  };

  return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Tạo bài viết mới</h3>

          {message.text && (
              <div
                  className={`p-3 rounded-lg mb-4 ${
                      message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
              >
                {message.text}
              </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Tiêu đề</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Nội dung</label>
              <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Trạng thái</label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
              >
                <option value="Draft">Bản nháp</option>
                <option value="Published">Công khai</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Danh mục</label>
              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
              >
                <option value={0}>Chọn danh mục</option>
                {categories?.length > 0 ? (
                    categories.map(({id,name}, index) => (
                        <option key={index} value={id}>
                          {name}
                        </option>
                    ))
                ) : (
                    <option disabled>Không có danh mục nào</option>
                )}
              </select>
            </div>

            {/* Input file thay thế cho nhập URL */}
            <div>
              <label className="block text-gray-700 font-medium">Chọn hình ảnh</label>
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
              />
            </div>

            {/* Hiển thị ảnh xem trước nếu có */}
            {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Ảnh xem trước:</p>
                  <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg"
                  />
                </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                  type="button"
                  onClick={() => navigate("/manager/blogs")}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tạo bài viết
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateBlogs;
