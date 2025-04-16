import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import './style.css';
import PageWrapper from "../../components/pageWrapper/PageWrapper";


const Contact = ({config}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý dữ liệu form ở đây (ví dụ: gửi dữ liệu đến API)
        console.log("Form Data Submitted:", formData);
        setSubmissionStatus("Form submitted successfully!");
        setFormData({
            name: "",
            email: "",
            phone: "",
            message: ""
        });
    };

    return (
        <PageWrapper title="Liên hệ">
        <div className="contact-page" id="yourElementId">
            <div className="contact-container">
                <div className="contact-grid">
                    {/* Left Column - Contact Form */}
                    <div className="contact-info">
                        <h2 className="company-title">CỬA HÀNG BẢO HỘ MINH XUÂN</h2>
                        <p className="company-description">
                            Hiện nay, Minh Xuân là một trong những Công ty lớn cung cấp và sản xuất tất cả các trang thiết bị bảo hộ, an toàn cho người lao động trên toàn quốc.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <MapPin className="contact-icon" size={20} />
                                <span>Địa chỉ: 4A, Hai Bà Trưng, Hà Nội</span>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" size={20} />
                                <span>Hotline: 043.987.5343 - 0912.423.042 - 0912.201.309</span>
                            </div>
                            <div className="contact-item">
                                <Mail className="contact-icon" size={20} />
                                <span>Email: minhxuanbh365@gmail.com</span>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <h3 className="form-title">GỬI THẮC MẮC CHO CHÚNG TÔI</h3>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Họ và tên"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Điện thoại"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <textarea
                                    name="message"
                                    placeholder="Nội dung"
                                    rows={4}
                                    className="form-textarea"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="submit-button"
                                >
                                    Gửi tin nhắn
                                </button>
                            </form>
                            {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
                        </div>
                    </div>

                    {/* Right Column - Map */}
                    <div className="map-container">
                        <iframe
                            title="Minh Xuan Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6963477031385!2d105.84772731476292!3d21.023821393283267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf6bb4f9a3f!2zNCBIYWkgQsOgIFRyxrBuZywgVHLhuqduIEjGsG5nIMSQ4bqhbywgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1645167116886!5m2!1svi!2s"
                            className="google-map"
                            referrerPolicy="no-referrer-when-downgrade"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
        </PageWrapper>
    );
};

export default Contact;