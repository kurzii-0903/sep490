"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Phone } from "lucide-react";

export default function StoreLocation({ config }) {
    const [contactInfo, setContactInfo] = useState({
        address: "",
        hotline: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm loại bỏ thẻ HTML
    const stripHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    // Gọi API để lấy thông tin địa chỉ và hotline
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get(`${config.baseUrl}/api/BlogPost/get-blog-by-category/lien-he`);
                const contactData = response.data;

                // Tìm bài post có title là "Địa chỉ" và "Điện thoại"
                const addressPost = contactData.find((post) => post.title.toLowerCase() === "địa chỉ");
                const phonePost = contactData.find((post) => post.title.toLowerCase() === "điện thoại");

                setContactInfo({
                    address: addressPost ? stripHtml(addressPost.content) : "Hai Bà Trưng, Hà Nội",
                    hotline: phonePost ? stripHtml(phonePost.content) : "0912.423.062",
                });
                setLoading(false);
            } catch (err) {
                setError("Không thể tải thông tin cửa hàng. Vui lòng thử lại sau!");
                setLoading(false);
                console.error("Error fetching store location:", err);
            }
        };

        fetchContactInfo();
    }, [config.baseUrl]); // Thêm config.baseUrl vào dependency array

    if (loading) {
        return <div className="text-center py-4 text-gray-600">Đang tải thông tin cửa hàng...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <section className="py-10 bg-[#f9f9f9]">
            <div className="px-4 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#b50a00] text-left relative inline-block after:block after:w-1/3 after:h-1 after:bg-yellow-400 after:mt-1 after:[clip-path:polygon(0%_0%,100%_0%,calc(100%-4px)_100%,0%_100%)]">
                    ĐỊA CHỈ CỬA HÀNG
                </h2>
            </div>

            {/* Nội dung */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bên trái: Thông tin địa chỉ và hotline */}
                    <div className="flex flex-col bg-white border shadow p-6 rounded">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 text-[#b50a00] mr-2" />
                            Thông tin liên hệ
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center">
                                <MapPin className="w-5 h-5 text-[#b50a00] mr-2" />
                                <span className="font-semibold">Địa chỉ:</span>
                                <span className="ml-1">{contactInfo.address}</span>
                            </p>
                            <p className="flex items-center">
                                <Phone className="w-5 h-5 text-[#b50a00] mr-2" />
                                <span className="font-semibold">Hotline:</span>
                                <a href={`tel:${contactInfo.hotline}`} className="ml-1 text-blue-500 hover:underline">
                                    {contactInfo.hotline}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Bên phải: Google Map */}
                    <div className="h-64 md:h-80 w-full rounded overflow-hidden border shadow">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6963477031385!2d105.84772731476292!3d21.023821393283267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf6bb4f9a3f!2zNCBIYWkgQsOgIFRyxrBuZywgVHLhuqduIEjGsG5nIMSQ4bqhbywgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1645167116886!5m2!1svi!2s"
                            className="w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store Location Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}