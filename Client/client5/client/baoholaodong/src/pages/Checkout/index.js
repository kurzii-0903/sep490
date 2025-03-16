import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';
import Loading from "../../components/Loading/Loading";
import './style.css';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate = useNavigate();
    const bankName = 'tpb';
    const accountNumber = '29909302002';
    const { cartItems, totalPrice, clearCart } = useContext(CartContext);

    const [quantity] = useState(cartItems.reduce((total, item) => total + item.quantity, 0));
    const [file, setFile] = useState(null);
    const [isRequired, setIsRequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        try {
            const cookieValue = getCookie("user");
            if (!cookieValue) setUserId(null);
            const decodedValue = decodeURIComponent(cookieValue);
            let parsedValue;
            try {
                parsedValue = JSON.parse(decodedValue);
            } catch (e) {
                const trimmedValue = decodedValue.replace(/^"|"$/g, '');
                parsedValue = JSON.parse(trimmedValue);
            }
            setUserId(parsedValue.userId);
        } catch (e) {
            setUserId(null);
        }
    }, []);

    return (
        <div className="checkout-page">
            <Loading isLoading={isLoading} />
            <div className="checkout-content">
                <div className="checkout-right">
                    <div className="order-summary-header">
                        <h3>Đơn hàng</h3>
                        <span className="total-quantity">({quantity} sản phẩm)</span>
                    </div>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.quantity} x {item.price.toLocaleString()}đ
                            </li>
                        ))}
                    </ul>
                    <div className="subtotal">
                        <strong>Tạm tính: {totalPrice.toLocaleString()}đ</strong>
                    </div>
                    <div className="shipping-fee">
                        <strong>Phí vận chuyển: 30,000đ</strong>
                    </div>
                    <div className="total-price">
                        <strong>Tổng cộng: {(totalPrice + 30000).toLocaleString()}đ</strong>
                    </div>
                    <div className="payment-proof">
                        <h3>QR Thanh toán</h3>
                        <div style={{ overflow: 'hidden', width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <img
                                id="previewImage"
                                src={`https://vietqr.co/api/generate/` + bankName + `/` + accountNumber + `/VIETQR.CO/` + totalPrice + `/hello`}
                                alt="Xem trước hình ảnh"
                                className="preview-image"
                                style={{ clipPath: 'inset(33% 25% 33% 25%)' }}
                            />
                        </div>
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="paymentProof"
                                form="shipping-form-id"
                                name="paymentProof"
                                accept="image/*"
                                className="file-input"
                                onChange={handleFileChange}
                                required={isRequired}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;