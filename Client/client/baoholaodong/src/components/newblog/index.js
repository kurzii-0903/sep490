import React from 'react';
import './style.css';
import {FaArrowRight} from "react-icons/fa";
import { FaClock } from 'react-icons/fa';

const NewBlog = () => {
    const blogs = [
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

    return (
        <section className="new-blog-section">
            <h2 className="new-blog-title">KIẾN THỨC AN TOÀN LAO ĐỘNG</h2>
            <div className="new-blog-list">
                {blogs.map((blog, index) => (
                    <div key={index} className="new-blog-item">
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
        </section>
    );
};

export default NewBlog;