import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils/SlugUtils";
import logo from '../../images/logo.gif';


const Footer = ({config}) => {
    const API_BASE = config.baseUrl;
    const [contactBlogs, setContactBlogs] = useState([]);
    const [policyBlogs, setPolicyBlogs] = useState([]);
    const [guideBlogs, setGuideBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

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

    const getContactLink = (blog) => {
        const titleLower = blog.title.toLowerCase();
        const content = stripHtmlTags(blog.content);
        if (titleLower.includes("địa chỉ")) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content)}`;
        if (titleLower.includes("điện thoại")) return `tel:${content.replace(/\D/g, "")}`;
        if (titleLower.includes("email")) return `mailto:${content}`;
        if (titleLower.includes("zalo")) return `https://zalo.me/${content.replace(/\D/g, "")}`;
        return null;
    };

    return (
        <footer className="w-full border-t-4 border-red-700 bg-gray-100 text-sm text-gray-700">
            <div className="max-w-screen-2xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Logo */}
                <div className="col-span-1 lg:col-span-2 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img src={logo} alt="Logo" className="w-24 h-32 object-contain" />
                        <div>
                            <p className="text-red-700 text-base font-bold uppercase">Bảo Hộ Lao Động Minh Xuân</p>
                            <p className="text-red-700 text-sm">Luôn đem lại an toàn và hoàn hảo nhất cho bạn!</p>
                        </div>
                    </div>
                    <p className="hidden lg:block text-sm">Bảo Hộ Lao Động Minh Xuân - Nhà cung cấp thiết bị bảo hộ lao động chất lượng cao.</p>
                </div>

                {/* Liên hệ */}
                <div>
                    <h4 className="text-red-700 font-bold uppercase mb-2">Liên Hệ</h4>
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : contactBlogs.length ? (
                        contactBlogs.map((blog) => {
                            const link = getContactLink(blog);
                            const content = stripHtmlTags(blog.content);
                            return (
                                <div key={blog.postId} className="mb-2">
                                    {link ? (
                                        <a href={link} className="hover:underline ">{blog.title}: {content}</a>
                                    ) : (
                                        <span className="hover:underline cursor-pointer " onClick={() => handleViewDetail(blog)}>
                      {blog.title}: {content}
                    </span>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>Không có thông tin liên hệ.</p>
                    )}
                </div>

                {/* Chính sách */}
                <div>
                    <h4 className="text-red-700 font-bold uppercase mb-2">Chính Sách</h4>
                    {policyBlogs.map((blog) => (
                        <div key={blog.postId} className="mb-2">
              <span className="hover:underline cursor-pointer" onClick={() => handleViewDetail(blog)}>
                {blog.title}
              </span>
                        </div>
                    ))}
                </div>

                {/* Hướng dẫn */}
                <div>
                    <h4 className="text-red-700 font-bold uppercase mb-2">Hướng Dẫn</h4>
                    {guideBlogs.map((blog) => (
                        <div key={blog.postId} className="mb-2">
              <span className="hover:underline cursor-pointer" onClick={() => handleViewDetail(blog)}>
                {blog.title}
              </span>
                        </div>
                    ))}
                </div>
            </div>


            {/* Bottom */}
            <div className="bg-gradient-to-t from-[#620805] to-[#c7170e] text-white py-4 text-center text-sm">
                © Bản quyền thuộc về <span className="text-yellow-300 font-semibold">Bảo Hộ Lao Động Minh Xuân</span> | Cung cấp bởi <span className="text-yellow-300 font-semibold">DTC</span>
            </div>
        </footer>
    );
};

export default Footer;