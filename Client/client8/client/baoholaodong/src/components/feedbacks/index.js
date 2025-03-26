import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './style.css';

const Feedbacks = () => {
    const feedbacks = [
        {
            avatar: "https://placehold.co/80x80",
            name: "Nguyen Van A",
            feedback: "Sản phẩm rất tốt, tôi rất hài lòng!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Tran Thi B",
            feedback: "Dịch vụ chăm sóc khách hàng tuyệt vời!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Le Van C",
            feedback: "Nhân viên phục vụ rất nhiệt tình!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Pham Thi D",
            feedback: "Giao hàng rất nhanh chóng!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Nguyen Van E",
            feedback: "Sản phẩm rất tốt, tôi rất hài lòng!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Tran Thi F",
            feedback: "Dịch vụ chăm sóc khách hàng tuyệt vời!"
        },
        {
            avatar: "https://placehold.co/80x80",
            name: "Le Van G",
            feedback: "Nhân viên phục vụ rất nhiệt tình!"
        },
        {
            avatar: "https://placehold.co/50x50",
            name: "Pham Thi H",
            feedback: "Giao hàng rất nhanh chóng!"
        },
        {
            avatar: "https://placehold.co/50x50",
            name: "Nguyen Van I",
            feedback: "Sản phẩm rất tốt, tôi rất hài lòng!"
        },
        {
            avatar: "https://placehold.co/50x50",
            name: "Tran Thi K",
            feedback: "Dịch vụ chăm sóc khách hàng tuyệt vời!"
        },
        {
            avatar: "https://placehold.co/50x50",
            name: "Le Van L",
            feedback: "Nhân viên phục vụ rất nhiệt tình!"
        },
        {
            avatar: "https://placehold.co/50x50",
            name: "Pham Thi M",
            feedback: "Giao hàng rất nhanh chóng!"
        },
    ];

    const feedbackListRef = useRef(null);

    const handlePrev = () => {
        if (feedbackListRef.current) {
            feedbackListRef.current.scrollBy({ left: -597, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (feedbackListRef.current) {
            feedbackListRef.current.scrollBy({ left: 597, behavior: 'smooth' });
        }
    };

    return (
        <section className="feedback-section">
            <div className="feedback-title">KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</div>
            <div className="feedback-subtitle">Hơn +50,000 khách hàng đang sử dụng cảm nhận như thế nào về Bảo Hộ Lao Động Minh Xuân</div>
            <div className="feedback-navigation">
                <button onClick={handlePrev} className="nav-button"><FaArrowLeft /></button>
                <button onClick={handleNext} className="nav-button"><FaArrowRight /></button>
            </div>
            <div className="feedback-list-container">
                <div className="feedback-list" ref={feedbackListRef}>
                    {feedbacks.map((item, index) => (
                        <div key={index} className="feedback-item">
                            <img src={item.avatar} alt={item.name} className="feedback-avatar" />
                            <div className="feedback-content">
                                <div className="feedback-name">{item.name}</div>
                                <div className="feedback-text">{item.feedback}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feedbacks;