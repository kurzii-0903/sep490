import React from 'react';
import './style.css';

const Footer = () => {
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
                        <div className="footer-contact-item">
                            <span>Địa chỉ: Hai Bà Trưng, Hà Nội</span>
                        </div>
                        <div className="footer-contact-item">
                            <span>Điện thoại: 0912.423.062</span>
                        </div>
                        <div className="footer-contact-item">
                            <span>Zalo: 0912.423.062</span>
                        </div>
                        <div className="footer-contact-item">
                            <span>Email: minhxuanbhld@gmail.com</span>
                        </div>
                    </div>
                    <div className="footer-branches">
                        <div className="footer-branches-title">Chuỗi Cửa Hàng</div>
                        <div className="footer-branches-item">Chi nhánh Hai Bà Trưng, Hà Nội</div>
                        {/* Add more branches as needed */}
                    </div>
                </div>

                {/* Policy Section */}
                <div className="footer-section">
                    <div className="footer-policy">
                        <div className="footer-policy-title">Chính Sách</div>
                        <div className="footer-policy-item">Chính sách mua hàng</div>
                        <div className="footer-policy-item">Chính sách thanh toán</div>
                        <div className="footer-policy-item">Chính sách vận chuyển</div>
                        <div className="footer-policy-item">Chính sách bảo mật</div>
                        <div className="footer-policy-item">Cam kết cửa hàng</div>
                        <div className="footer-policy-item">Chính sách thành viên</div>
                    </div>
                </div>

                {/* Guide Section */}
                <div className="footer-section">
                    <div className="footer-guide">
                        <div className="footer-guide-title">Hướng Dẫn</div>
                        <div className="footer-guide-item">Hướng dẫn mua hàng</div>
                        <div className="footer-guide-item">Hướng dẫn đổi trả</div>
                        <div className="footer-guide-item">Hướng dẫn chuyển khoản</div>
                        <div className="footer-guide-item">Hướng dẫn trả góp</div>
                        <div className="footer-guide-item">Hướng dẫn hoàn hàng</div>
                        <div className="footer-guide-item">Kiểm tra đơn hàng</div>
                    </div>
                </div>

                {/* Support Section (Payment Methods and Certification) */}
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

            {/* Bottom Section (Only for Mobile) */}
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