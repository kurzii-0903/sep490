import React, { useState } from 'react';
import { FaFilter, FaClock, FaArrowRight } from 'react-icons/fa';
import './style.css';

const BlogList = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const filters = [
        "Tin tức về PCCH",
        "Kiến thức về an toàn lao động",
        "Tin tức về an toàn vệ sinh",
        "Tin tức về sức khỏe lao động",
        "Tin tức về tinh thần lao động",
    ];

    const sampleBlogs = [
        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },
        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },
        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },

        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },

        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },

        {
            title: "Tầm quan trọng của đồ bảo hộ lao động",
            description: "Đồ bảo hộ lao động giúp người lao động tránh được nguy hiểm từ tai nạn lao động như chấn thương, bỏng, hay ngộ độc. Việc trang bị đầy đủ đồ bảo hộ như mũ, găng tay, áo chống cháy là điều bắt buộc.",
            image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
            date: "06/09/2024"
        },
    ];

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter)
                ? prev.filter((item) => item !== filter)
                : [...prev, filter]
        );
    };

    return (
        <div className="blog-list-container">
            <div className="blog-filter">
                <div className="filter-header">
                    <FaFilter className="filter-icon" />
                    <span className="filter-title">BỘ LỌC TIN TỨC</span>
                </div>
                <div className="filter-options">
                    <h3 className="filter-subtitle">CHỌN THÊM TIN TỨC</h3>
                    {filters.map((filter, index) => (
                        <label key={index} className="filter-label">
                            <input
                                type="checkbox"
                                checked={selectedFilters.includes(filter)}
                                onChange={() => handleFilterChange(filter)}
                                className="filter-checkbox"
                            />
                            <span>{filter}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="blog-list">
                <h2 className="all-blog-title">Kiến thức an toàn lao động</h2>
                <div className="all-blog-list">
                    {sampleBlogs.map((blog, index) => (
                        <div key={index} className="all-blog-item">
                            <div className="new-blog-image-container">
                                <img src={blog.image} alt={blog.title} className="new-blog-image" />
                                <div className="new-blog-date">
                                    <FaClock className="new-blog-date-icon" />
                                    <div className="new-blog-date-text">{blog.date}</div>
                                </div>
                            </div>
                            <div className="new-blog-content">
                                <h3 className="new-blog-item-title">{blog.title}</h3>
                                <p className="new-blog-description">{blog.description}</p>
                            </div>
                            <div className="new-blog-read-more">
                                <button className="new-blog-read-more-button">
                                    <div className="new-blog-read-more-text">Xem chi tiết <FaArrowRight className="inline" /></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;