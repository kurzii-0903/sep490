import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';
import Loading from "../../components/Loading/Loading";
import './style.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { CheckCircle, X, Upload, CreditCard, ArrowLeft, ShoppingBag, Truck, Clock } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const Checkout = () => {
    const navigate = useNavigate();
    const bankName = 'tpb';
    const accountNumber = '29909302002';
    const { cartItems, totalPrice, clearCart } = useContext(CartContext);

    const [quantity] = useState(cartItems.reduce((total, item) => total + item.quantity, 0));
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isRequired, setIsRequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [hubConnection, setHubConnection] = useState(null);
    const [message, setMessage] = useState({ show: false, text: '', type: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    const [invoiceNumber, setInvoiceNumber] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const invoice = params.get("invoiceNumber");
        setInvoiceNumber(invoice);
    }, []);

    useEffect(() => {
        // Khởi tạo kết nối SignalR
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/orderHub`)
            .withAutomaticReconnect()
            .build();

        newConnection
            .start()
            .then(() => {
                console.log("Kết nối đến SignalR thành công!");
            })
            .catch((err) => console.error("Lỗi kết nối SignalR:", err));

        setHubConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    const handleConfirmPayment = async () => {
        try {
            if (!file) {
                setMessage({
                    show: true,
                    text: "Vui lòng tải lên ảnh xác nhận thanh toán trước.",
                    type: 'error'
                });
                setTimeout(() => setMessage({ show: false, text: '', type: '' }), 5000);
                return;
            }

            setIsLoading(true);
            const formData = new FormData();
            formData.append("File", file);
            formData.append("InvoiceNumber", invoiceNumber);
            formData.append("Status", "pending");

            const response = await axios.put(`${BASE_URL}/api/Invoice/confirm-invoice-by-customer`, formData);

            setIsLoading(false);
            setMessage({
                show: true,
                text: "Xác nhận thanh toán thành công!",
                type: 'success'
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.log("Error:", error);
            setIsLoading(false);
            setMessage({
                show: true,
                text: "Đã xảy ra lỗi khi xác nhận thanh toán. Vui lòng thử lại.",
                type: 'error'
            });
            setTimeout(() => setMessage({ show: false, text: '', type: '' }), 5000);
        }
    };

    return (
        <div className="checkout-container">
            <Loading isLoading={isLoading} />

            {/* Header */}
            <div className="checkout-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>
                <h1 className="checkout-title">Thanh toán</h1>
            </div>

            {/* Notification */}
            {message.show && (
                <div className={`notification ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="notification-icon" size={20} />
                    ) : (
                        <X className="notification-icon" size={20} />
                    )}
                    {message.text}
                </div>
            )}

            {/* Main Content */}
            <div className="checkout-content">
                {/* Left Column - Payment Information */}
                <div className="checkout-left">
                    <div className="checkout-section">
                        <div className="section-header">
                            <CreditCard size={20} />
                            <h2>Thông tin thanh toán</h2>
                        </div>

                        <div className="payment-info">
                            <div className="bank-info">
                                <div className="info-row">
                                    <span className="info-label">Ngân hàng:</span>
                                    <span className="info-value">TPBank</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Số tài khoản:</span>
                                    <span className="info-value">{accountNumber}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Số tiền:</span>
                                    <span className="info-value highlight">{(totalPrice + 30000).toLocaleString()}đ</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Nội dung CK:</span>
                                    <span className="info-value">Thanh toan don hang {invoiceNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="qr-section">
                            <h3>Quét mã QR để thanh toán</h3>
                            <div className="qr-code-container">
                                <img
                                    src={`https://vietqr.co/api/generate/${bankName}/${accountNumber}/VIETQR.CO/${totalPrice + 30000}/chuyenkhoan`}
                                    alt="Mã QR thanh toán"
                                    className="qr-image"
                                />
                            </div>
                        </div>

                        <div className="upload-section">
                            <h3>Xác nhận thanh toán</h3>
                            <p className="upload-instruction">
                                <Clock size={16} className="instruction-icon" />
                                Vui lòng tải lên ảnh chụp màn hình xác nhận thanh toán để hoàn tất đơn hàng
                            </p>

                            <div className="file-upload-container">
                                <label htmlFor="paymentProof" className="file-upload-label">
                                    <Upload size={20} className="upload-icon" />
                                    <span>Chọn ảnh xác nhận thanh toán</span>
                                </label>
                                <input
                                    type="file"
                                    id="paymentProof"
                                    name="paymentProof"
                                    accept="image/*"
                                    className="file-input"
                                    onChange={handleFileChange}
                                    required={isRequired}
                                />
                            </div>

                            {filePreview && (
                                <div className="file-preview">
                                    <img src={filePreview || "/placeholder.svg"} alt="Preview" />
                                    <div className="file-info">
                                        <span className="file-name">{file?.name}</span>
                                        <button className="remove-file" onClick={removeFile}>
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                className="confirm-payment-btn"
                                onClick={handleConfirmPayment}
                                disabled={!file}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="checkout-right">
                    <div className="checkout-section">
                        <div className="section-header">
                            <ShoppingBag size={20} />
                            <h2>Đơn hàng</h2>
                            <span className="item-count">({quantity} sản phẩm)</span>
                        </div>

                        <div className="order-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="item-image">
                                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h4 className="item-name">{item.name}</h4>
                                        <div className="item-meta">
                                            {item.variant && (
                                                <span className="item-variant">
                                                    {item.variant.color}, {item.variant.size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-price-info">
                                        <span className="item-quantity">x{item.quantity}</span>
                                        <span className="item-price">{item.price.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{totalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="summary-row">
                                <span className="with-icon">
                                    <Truck size={16} />
                                    Phí vận chuyển:
                                </span>
                                <span>30,000đ</span>
                            </div>
                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{(totalPrice + 30000).toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
