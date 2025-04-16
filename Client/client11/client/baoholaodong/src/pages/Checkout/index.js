
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import Loading from "../../components/Loading/Loading";
import './style.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { CheckCircle, X, Upload, CreditCard, ArrowLeft, ShoppingBag, Truck, Clock } from 'lucide-react';
import PageWrapper from "../../components/pageWrapper/PageWrapper";

const Checkout = ({config}) => {
    const BASE_URL = config.baseUrl;
    const navigate = useNavigate();
    const bankName = 'tpb';
    const accountNumber = '29909302002';
    const { cartItems, totalPrice } = useContext(CartContext);

    const [quantity] = useState(cartItems.reduce((total, item) => total + item.quantity, 0));
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isRequired, setIsRequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hubConnection, setHubConnection] = useState(null);
    const [message, setMessage] = useState({ show: false, text: '', type: '' });
    const [invoiceNumber, setInvoiceNumber] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const invoice = params.get("invoiceNumber");
        setInvoiceNumber(invoice);
    }, []);


//#region hub

    useEffect(() => {
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
 //#endregion hub
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
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

            await axios.put(`${BASE_URL}/api/Invoice/confirm-invoice-by-customer`, formData);

            setIsLoading(false);
            setMessage({
                show: true,
                text: "Xác nhận thanh toán thành công!",
                type: 'success'
            });

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
        <PageWrapper title="Thanh toán">
            <div className="checkout-container">
                <Loading isLoading={isLoading} />

                <div className="checkout-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        <span>Quay lại</span>
                    </button>
                    <h1 className="checkout-title">Thanh toán</h1>
                </div>

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

                {message.type === "success" ? (
                    <div className="after-payment-actions">
                        <h3 className="thank-you-title">🎉 Thanh toán đã được ghi nhận!</h3>
                        <p className="thank-you-desc">
                            Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể. Bạn có thể:
                        </p>
                        <div className="button-group">
                            <button onClick={() => navigate("/account/orders")} className="btn-view-orders">
                                Xem đơn hàng của tôi
                            </button>
                            <button onClick={() => navigate("/")} className="btn-go-home">
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="checkout-content">
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
                                            <span className="info-value highlight">{((totalPrice || 0)).toLocaleString()}đ</span>
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
                                            src={`https://vietqr.co/api/generate/${bankName}/${accountNumber}/VIETQR.CO/${(totalPrice || 0)}/chuyenkhoan`}
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
                                                <img src={item.image || item.variant?.image || "/placeholder.svg"} alt={item.name || item.variant?.name || "Sản phẩm"} />
                                            </div>
                                            <div className="item-details">
                                                <h4 className="item-name">{item.name || item.variant?.name || "Sản phẩm không tên"}</h4>
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
                                                <span className="item-price">
                                                    {((item.price > 0 ? item.price : item.variant?.price || 0).toLocaleString())}đ
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>Tạm tính:</span>
                                        <span>{(totalPrice || 0).toLocaleString()}đ</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Tổng cộng:</span>
                                        <span>{((totalPrice || 0)).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Checkout;
