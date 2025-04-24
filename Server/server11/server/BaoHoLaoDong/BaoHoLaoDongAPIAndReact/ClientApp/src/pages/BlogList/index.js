import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaHome, FaFilter, FaClock, FaArrowRight } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toSlug } from "../../utils/SlugUtils";
import PageWrapper from "../../components/pageWrapper/PageWrapper";

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
                const response = await axios.get(`/api/BlogPost/get-blog-categories`);
                const categoriesWithSlug = response.data.map(category => ({
                    ...category,
                    slug: toSlug(category.name),
                }));
                setFilters([{ id: 0, name: "Tất cả", slug: "" }, ...categoriesWithSlug]);
            } catch (err) {
                console.error("Lỗi khi tải danh mục blog:", err.response?.data || err.message);
                setError("Lỗi khi tải danh mục blog");
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
            console.log("Fetching blogs with params:", { categoryId, page, pageSize });
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `/api/BlogPost/get-blog-page?categoryId=${categoryId}&page=${page}&size=${pageSize}` // Sửa đường dẫn
                );
                console.log("API response:", response.data);
                setBlogs(response.data.items);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu blog:", err.response?.data || err.message);
                setError("Lỗi khi tải dữ liệu blog: " + (err.response?.data?.message || err.message));
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
        return plainText.length <= maxLength
            ? plainText
            : plainText.substring(0, maxLength) + "...";
    };

    return (
        <PageWrapper title="Danh sách bài viết">
            <div className="container mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center py-2.5 px-4 sm:px-17 lg:px-6 text-sm">
                    <a href="/" className="flex items-center text-red-600 hover:underline">
                        <FaHome className="mr-1" />
                        Trang chủ
                    </a>
                    <ChevronRight className="mx-2.5 text-gray-400" />
                    <span className="text-black">Danh sách bài viết</span>
                </nav>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-5 px-2.5 sm:px-12 lg:px-12 py-12">
                    {/* Filter sidebar */}
                    <div className="w-full lg:w-72 flex-shrink-0 border border-gray-100 bg-white">
                        <div className="flex items-center bg-gradient-to-t from-[#620805] to-[#c7170e] text-yellow-400 p-2.5">
                            <FaFilter className="mr-2" />
                            <span className="font-bold">BỘ LỌC TIN TỨC</span>
                        </div>
                        <div className="p-5">
                            {filters.map((filter) => (
                                <label key={filter.id} className="flex items-center mb-2.5 truncate">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={categoryId === filter.id}
                                        onChange={() => handleCategoryChange(filter)}
                                        className="mr-2 accent-red-600"
                                    />
                                    <span>{filter.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Blog list */}
                    <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-[#b50a00] relative inline-block after:block after:w-1/3 after:h-1 after:bg-yellow-400 after:mt-1">
                            Danh sách bài viết
                        </h2>

                        {loading ? (
                            <p className="text-center text-gray-500 mt-4">Đang tải dữ liệu...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center mt-4">{error}</p>
                        ) : blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog.postId}
                                        className="flex flex-col justify-between bg-white border shadow hover:-translate-y-1 transition-transform duration-300 h-full rounded overflow-hidden"
                                    >
                                        {/* Hình ảnh */}
                                        <div className="relative w-full h-[200px]">
                                            <img
                                                src={blog.imageUrl || "https://via.placeholder.com/150"}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 text-sm flex items-center gap-1 rounded">
                                                <FaClock className="text-gray-600" />
                                                <span className="text-gray-700 text-xs">
                          {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                                            </div>
                                        </div>

                                        {/* Nội dung */}
                                        <div className="p-4 flex flex-col gap-2 flex-grow">
                                            <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {truncateText(blog.content, 100)}
                                            </p>
                                        </div>

                                        {/* Xem chi tiết */}
                                        <div className="px-4 pb-4">
                                            <button
                                                onClick={() => handleViewDetail(blog)}
                                                className="w-full bg-[#b50a00] text-white font-semibold py-2 text-sm rounded-md hover:bg-yellow-400 hover:text-[#b50a00] transition-all duration-300"
                                            >
                                                Xem chi tiết <FaArrowRight className="inline ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Không có bài viết nào.</p>
                        )}

                        {/* Pagination */}
                        {blogs.length > 0 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        className="flex items-center px-4 py-2 bg-[#b50a00] text-white rounded-md disabled:bg-gray-300 hover:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaChevronLeft className="mr-1" />
                                        Trước
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setPage(index + 1)}
                                            className={`px-4 py-2 border rounded-md ${
                                                page === index + 1 ? "bg-[#b50a00] text-white" : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                        className="flex items-center px-4 py-2 bg-[#b50a00] text-white rounded-md disabled:bg-gray-300 hover:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
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
        </PageWrapper>
    );
};

export default BlogList;