import React from 'react';
import './style.css';

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <img src="http://baoholaodongminhxuan.com/images/common/logo1.gif" alt="Logo" className="footer-logo-image" />
                        <div className="footer-logo-text">BẢO HỘ LAO ĐỘNG MINH XUÂN</div>
                        <div className="footer-slogan">Luôn đem lại an toàn và hoàn hảo nhất cho bạn!</div>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-contact">
                        <div className="footer-policy-title">Liên hệ</div>
                        <div className="footer-contact-item">
                            <span className="footer-contact-title">Địa chỉ: Hai bà Trưng, Hà Nội</span>
                        </div>
                        <div className="footer-contact-item">
                            <span className="footer-contact-title">Điện thoại: 0912.423.062 </span>
                        </div>
                        <div className="footer-contact-item">
                            <span className="footer-contact-title">Email: minhxuanbhld@gmail.com </span>
                        </div>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-policy">
                        <div className="footer-policy-title">Chính sách</div>
                        <div className="footer-policy-item">Chính sách mua hàng</div>
                        <div className="footer-policy-item">Chính sách thanh toán</div>
                        <div className="footer-policy-item">Chính sách vận chuyển</div>
                        <div className="footer-policy-item">Chính sách bảo mật</div>
                        <div className="footer-policy-item">Cam kết cửa hàng</div>
                        <div className="footer-policy-item">Chính sách thành viên</div>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-guide">
                        <div className="footer-guide-title">Hướng dẫn</div>
                        <div className="footer-guide-item">Hướng dẫn mua hàng</div>
                        <div className="footer-guide-item">Hướng dẫn đổi trả</div>
                        <div className="footer-guide-item">Hướng dẫn chuyển khoản</div>
                        <div className="footer-guide-item">Hướng dẫn trả góp</div>
                        <div className="footer-guide-item">Hướng dẫn hoàn hàng</div>
                        <div className="footer-guide-item">Kiểm tra đơn hàng</div>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="footer-support">
                        <div className="footer-support-title">Hỗ trợ thanh toán</div>
                        <div className="footer-support-logos">
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                            <img src="https://via.placeholder.com/55x25" alt="Payment Logo" className="footer-support-logo" />
                        </div>
                        <div className="footer-certification-title">Được chứng nhận bởi</div>
                        <img src="https://via.placeholder.com/160x52" alt="Certification Logo" className="footer-certification-logo" />
                    </div>
                </div>
            </div>
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