import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { FaArrowRight, FaArrowLeft, FaClock } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toSlug } from "../../utils/SlugUtils";

const API_BASE = process.env.REACT_APP_BASE_URL_API;

const NewBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    // Hàm xử lý loại bỏ HTML và rút gọn nội dung
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

    // Gọi API để lấy danh sách bài blog theo danh mục "Kiến Thức An Toàn Lao Động"
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                // Lấy danh sách danh mục
                const categoriesResponse = await axios.get(`${API_BASE}/api/BlogPost/get-blog-categories`);
                const categories = categoriesResponse.data;

                // Tìm danh mục "KIẾN THỨC AN TOÀN LAO ĐỘNG"
                const targetCategory = categories.find(
                    (cat) => cat.name === "KIẾN THỨC AN TOÀN LAO ĐỘNG"
                );
                if (!targetCategory) {
                    throw new Error("Không tìm thấy danh mục 'KIẾN THỨC AN TOÀN LAO ĐỘNG'");
                }

                // Tạo slug từ tên danh mục
                const categorySlug = toSlug(targetCategory.name);

                // Gọi API lấy bài viết theo slug
                const blogsResponse = await axios.get(
                    `${API_BASE}/api/BlogPost/get-blog-by-category/${categorySlug}`
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

    // Hàm điều hướng khi nhấp "Xem chi tiết"
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
            <button className="new-blog-nav-button">
                <FaArrowLeft />
            </button>
        ),
        nextArrow: (
            <button className="new-blog-nav-button">
                <FaArrowRight />
            </button>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
        ],
    };

    return (
        <section className="new-blog-section">
            <div className="new-blog-title-container">
                <h2 className="new-blog-title">KIẾN THỨC AN TOÀN LAO ĐỘNG</h2>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : blogs.length > 0 ? (
                <Slider {...settings} ref={sliderRef} className="blog-slider">
                    {blogs.map((blog) => (
                        <div key={blog.postId} className="new-blog-item">
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
                                <p className="new-blog-description">
                                    {truncateText(blog.content, 100)}
                                </p>
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
                </Slider>
            ) : (
                <p className="text-center text-gray-500">Không có bài viết nào.</p>
            )}
        </section>
    );
};

export default NewBlog;