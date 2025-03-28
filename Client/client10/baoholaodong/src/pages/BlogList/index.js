import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaHome, FaFilter, FaClock, FaArrowRight } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toSlug } from "../../utils/SlugUtils";
import "./style.css";

const API_BASE = process.env.REACT_APP_BASE_URL_API;

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryId, setCategoryId] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const navigate = useNavigate();
    const location = useLocation();

    const getCategorySlugFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get("cate") || "";
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/BlogPost/get-blog-categories`);
                const categoriesWithSlug = response.data.map(category => ({
                    ...category,
                    slug: toSlug(category.name),
                }));
                setFilters([{ id: 0, name: "Tất cả", slug: "" }, ...categoriesWithSlug]);
            } catch (err) {
                console.error("Lỗi khi tải danh mục blog", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const currentSlug = getCategorySlugFromQuery();
        if (filters.length > 0 && currentSlug) {
            const selectedFilter = filters.find(f => f.slug === currentSlug);
            if (selectedFilter && selectedFilter.id !== categoryId) {
                setCategoryId(selectedFilter.id);
                setPage(1);
            }
        } else if (!currentSlug && categoryId !== 0) {
            setCategoryId(0);
        }
    }, [location.search, filters]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE}/api/BlogPost/get-blog-page?categoryId=${categoryId}&page=${page}&size=${pageSize}`
                );
                setBlogs(response.data.items);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu blog");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [categoryId, page]);

    const handleCategoryChange = (filter) => {
        setCategoryId(filter.id);
        setPage(1);
        const newSlug = filter.slug || "";
        navigate(newSlug ? `/blogs?cate=${newSlug}` : "/blogs");
    };

    const handleViewDetail = (blog) => {
        const blogSlug = blog.slug || toSlug(blog.title);
        navigate(`/blogs/${blogSlug}`);
    };

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    const truncateText = (html, maxLength) => {
        const plainText = stripHtmlTags(html);
        if (plainText.length <= maxLength) {
            return plainText;
        }
        return plainText.substring(0, maxLength) + "...";
    };

    return (
        <div className="blog-container">
            <nav className="breadcrumb-blog-list">
                <a href="/" className="breadcrumb-item">
                    <FaHome className="breadcrumb-icon" />
                    Trang chủ
                </a>
                <ChevronRight className="breadcrumb-separator" />
                <span className="breadcrumb-item active">Danh sách bài viết</span>
            </nav>

            <div className="blog-list-container">
                <div className="blog-filter">
                    <div className="filter-header">
                        <FaFilter className="filter-icon" />
                        <span className="filter-title">BỘ LỌC TIN TỨC</span>
                    </div>
                    <div className="filter-options">
                        {filters.map((filter) => (
                            <label key={filter.id} className="filter-label">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={categoryId === filter.id}
                                    onChange={() => handleCategoryChange(filter)}
                                    className="filter-radio"
                                />
                                <span>{filter.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="blog-list">
                    <h2 className="all-blog-title">Danh sách bài viết</h2>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : blogs.length > 0 ? (
                        <div className="all-blog-list">
                            {blogs.map((blog) => (
                                <div key={blog.postId} className="all-blog-item">
                                    <div className="new-blog-image-container">
                                        <img
                                            src={blog.imageUrl || "https://via.placeholder.com/150"}
                                            alt={blog.title}
                                            className="new-blog-image"
                                        />
                                        <div className="new-blog-date">
                                            <FaClock className="new-blog-date-icon" />
                                            <div className="new-blog-date-text">
                                                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="new-blog-content">
                                        <h3 className="new-blog-item-title">{blog.title}</h3>
                                        <p className="new-blog-description">{truncateText(blog.content, 100)}</p>
                                    </div>
                                    <div className="new-blog-read-more">
                                        <button
                                            className="new-blog-read-more-button"
                                            onClick={() => handleViewDetail(blog)}
                                        >
                                            <div className="new-blog-read-more-text">
                                                Xem chi tiết <FaArrowRight className="inline" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Không có bài viết nào.</p>
                    )}

                    {blogs.length > 0 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    className={`px-4 py-2 rounded-md border ${
                                        page === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                                    } flex items-center`}
                                >
                                    <FaChevronLeft className="mr-1" />
                                    Trước
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setPage(index + 1)}
                                        className={`px-4 py-2 rounded-md border ${
                                            page === index + 1 ? "bg-red-600 text-white" : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    className={`px-4 py-2 rounded-md border ${
                                        page === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                                    } flex items-center`}
                                >
                                    Sau
                                    <FaChevronRight className="ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogList;