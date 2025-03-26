import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils/SlugUtils";
import "./style.css";

const API_BASE = process.env.REACT_APP_BASE_URL_API;

const Footer = () => {
    const [contactBlogs, setContactBlogs] = useState([]);
    const [policyBlogs, setPolicyBlogs] = useState([]);
    const [guideBlogs, setGuideBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm xử lý loại bỏ HTML từ content
    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    // Gọi API cho từng danh mục
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const contactResponse = await axios.get(`${API_BASE}/api/BlogPost/get-blog-by-category/lien-he`);
                setContactBlogs(contactResponse.data);

                const policyResponse = await axios.get(`${API_BASE}/api/BlogPost/get-blog-by-category/chinh-sach`);
                setPolicyBlogs(policyResponse.data);

                const guideResponse = await axios.get(`${API_BASE}/api/BlogPost/get-blog-by-category/huong-dan`);
                setGuideBlogs(guideResponse.data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu footer");
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

    return (
        <div className="footer-container">
            <div className="footer-content">
                {/* Logo Section */}
                <div className="footer-section">
                    <div className="footer-logo">
                        <img
                            src="http://baoholaodongminhxuan.com/images/common/logo1.gif"
                            alt="Logo"
                            className="footer-logo-image"
                        />
                        <div>
                            <div className="footer-logo-text">BẢO HỘ LAO ĐỘNG MINH XUÂN</div>
                            <div className="footer-slogan">Luôn đem lại an toàn và hoàn hảo nhất cho bạn!</div>
                        </div>
                    </div>
                    <div className="footer-description">
                        Bảo Hộ Lao Động Minh Xuân - Nhà cung cấp thiết bị bảo hộ lao động chất lượng cao, đảm bảo an toàn tối đa cho người lao động tại Việt Nam.
                    </div>
                    <div className="footer-social">
                        <img src="https://via.placeholder.com/30" alt="Facebook" className="footer-social-icon" />
                        <img src="https://via.placeholder.com/30" alt="Instagram" className="footer-social-icon" />
                        <img src="https://via.placeholder.com/30" alt="Shopee" className="footer-social-icon" />
                        <img src="https://via.placeholder.com/30" alt="Lazada" className="footer-social-icon" />
                        <img src="https://via.placeholder.com/30" alt="TikTok" className="footer-social-icon" />
                    </div>
                </div>

                {/* Contact Section */}
                <div className="footer-section">
                    <div className="footer-contact">
                        <div className="footer-contact-title">Liên Hệ</div>
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : contactBlogs.length > 0 ? (
                            contactBlogs.map((blog) => (
                                <div key={blog.postId} className="footer-contact-item">
                                    <span
                                        className="footer-link"
                                        onClick={() => handleViewDetail(blog)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {blog.title}: {stripHtmlTags(blog.content)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Không có thông tin liên hệ.</p>
                        )}
                    </div>
                </div>

                {/* Policy Section */}
                <div className="footer-section">
                    <div className="footer-policy">
                        <div className="footer-policy-title">Chính Sách</div>
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : policyBlogs.length > 0 ? (
                            policyBlogs.map((blog) => (
                                <div key={blog.postId} className="footer-policy-item">
                                    <span
                                        className="footer-link"
                                        onClick={() => handleViewDetail(blog)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {blog.title}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Không có chính sách nào.</p>
                        )}
                    </div>
                </div>

                {/* Guide Section */}
                <div className="footer-section">
                    <div className="footer-guide">
                        <div className="footer-guide-title">Hướng Dẫn</div>
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : guideBlogs.length > 0 ? (
                            guideBlogs.map((blog) => (
                                <div key={blog.postId} className="footer-guide-item">
                                    <span
                                        className="footer-link"
                                        onClick={() => handleViewDetail(blog)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {blog.title}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Không có hướng dẫn nào.</p>
                        )}
                    </div>
                </div>

                {/* Support Section */}
                <div className="footer-section">
                    <div className="footer-support">
                        <div className="footer-support-title">Hỗ Trợ Thanh Toán</div>
                        <div className="footer-support-logos">
                            <img src="https://via.placeholder.com/55x25" alt="MoMo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="ZaloPay" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="VNPayQR" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Moca" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Visa" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="ATM" className="footer-support-logo" />
                        </div>
                        <div className="footer-certification">
                            <div className="footer-certification-title">Được Chứng Nhận Bởi</div>
                            <img
                                src="https://via.placeholder.com/160x52"
                                alt="Certification Logo"
                                className="footer-certification-logo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-bottom-text">
                    <span>© Bản quyền thuộc về </span>
                    <span className="footer-bottom-highlight">Bảo Hộ Lao Động Minh Xuân</span>
                    <span> | Cung cấp bởi </span>
                    <span className="footer-bottom-highlight">DTC</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;