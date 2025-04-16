import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaClock } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toSlug } from "../../utils/SlugUtils";
import {getConfig} from "../../config";


const NewBlog = ({config}) => {
    const BASE_URL = config.baseUrl;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const categoriesResponse = await axios.get(
                    `${BASE_URL}/api/BlogPost/get-blog-categories`
                );
                const targetCategory = categoriesResponse.data.find(
                    (cat) => cat.name === "KIẾN THỨC AN TOÀN LAO ĐỘNG"
                );
                if (!targetCategory) throw new Error("Không tìm thấy danh mục");

                const slug = toSlug(targetCategory.name);
                const blogsResponse = await axios.get(
                    `${BASE_URL}/api/BlogPost/get-blog-by-category/${slug}`
                );
                setBlogs(blogsResponse.data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu blog");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleViewDetail = (blog) => {
        const blogSlug = blog.slug || toSlug(blog.title);
        navigate(`/blogs/${blogSlug}`);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: (
            <button className="bg-[#b50a00] text-white px-3 py-2 rounded hover:bg-yellow-400 disabled:bg-gray-300">
                <FaArrowLeft />
            </button>
        ),
        nextArrow: (
            <button className="bg-[#b50a00] text-white px-3 py-2 rounded hover:bg-yellow-400 disabled:bg-gray-300">
                <FaArrowRight />
            </button>
        ),
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <section className="py-10 bg-[#f9f9f9]">
            {/* Tiêu đề ra ngoài container để sát trái màn hình */}
            <div className="px-4 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#b50a00] text-left relative inline-block after:block after:w-1/3 after:h-1 after:bg-yellow-400 after:mt-1 after:[clip-path:polygon(0%_0%,100%_0%,calc(100%-4px)_100%,0%_100%)]">
                    KIẾN THỨC AN TOÀN LAO ĐỘNG
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : blogs.length > 0 ? (
                    <Slider {...settings} ref={sliderRef}>
                        {blogs.map((blog) => (
                            <div key={blog.postId} className="px-2">
                                <div className="flex flex-col justify-between bg-white border shadow hover:-translate-y-1 transition-transform duration-300 h-full rounded overflow-hidden">
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
                                            className="w-full bg-[#b50a00] text-white font-semibold py-2 text-sm rounded-md hover:bg-yellow-400 hover:text-[#b50a00] transition-all duration-300 clip-path-[polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]"
                                        >
                                            Xem chi tiết <FaArrowRight className="inline ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p className="text-center text-gray-500">Không có bài viết nào.</p>
                )}
            </div>
        </section>
    );
};

export default NewBlog;