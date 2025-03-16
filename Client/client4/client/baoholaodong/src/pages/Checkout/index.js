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
    const { createOrder } = useContext(OrderContext);
    const [shippingInfo, setShippingInfo] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        address: '',
        province: '',
        district: '',
        commune: '',
    });
    const [quantity] = useState(cartItems.reduce((total, item) => total + item.quantity, 0));
    const [paymentMethod, setPaymentMethod] = useState('');
    const [file, setFile] = useState(null);
    const [isRequired, setIsRequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value === 'Chuyển khoản') {
            setIsRequired(true);
        } else {
            setIsRequired(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formData = new FormData();
            const invoice = {
                amount: totalPrice + 30000,
                paymentMethod,
                qRCodeData: 'hello',
                paymentStatus: 'Pending',
            };
            const order = {
                customerId: userId,
                customerInfo: shippingInfo,
                totalPrice: totalPrice + 30000,
                orderDetails: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    size: null,
                    color: null,
                })),
                invoice,
            };
            const stringData = JSON.stringify(order, null, 2);
            formData.append('InvoiceImage', file);
            formData.append('OrderInfo', stringData);
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }    
            await createOrder(formData);
            alert('Đặt hàng thành công!');
            clearCart();
            navigate('/');
            setIsLoading(false);
        } catch (err) {
            if (err.errors) {
                let errorMessages = [];
                for (let field in err.errors) {
                    err.errors[field].forEach(message => {
                        errorMessages.push(`${field}: ${message}`);
                    });
                }
                alert(errorMessages.join("\n"));
            } else {
                alert(err.message);
            }
        }
        finally {
            setIsLoading(false);
        }
    };

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
                <div className="checkout-left">
                    <div className="logo-container">
                        <img src="http://baoholaodongminhxuan.com/images/common/logo1.gif" alt="Company Logo" className="company-logo" />
                    </div>
                    <div className="checkout-left-content">
                        <form id="shipping-form-id" className="shipping-form" onSubmit={handleSubmit}>
                            <h3 className="bold-text">Thông tin mua hàng</h3>
                            <input type="email" name="email" placeholder="Email" value={shippingInfo.email} onChange={handleInputChange} required />
                            <input type="text" name="name" placeholder="Họ và Tên" value={shippingInfo.name} onChange={handleInputChange} required />
                            <input type="text" name="phoneNumber" placeholder="Số điện thoại" value={shippingInfo.phoneNumber} onChange={handleInputChange} required />
                            <input type="text" name="address" placeholder="Địa chỉ" value={shippingInfo.address} onChange={handleInputChange} required />
                            <input type="text" name="province" placeholder="Tỉnh thành" value={shippingInfo.province} onChange={handleInputChange} required />
                            <input type="text" name="district" placeholder="Quận huyện" value={shippingInfo.district} onChange={handleInputChange} required />
                            <input type="text" name="commune" placeholder="Phường xã" value={shippingInfo.commune} onChange={handleInputChange} required />
                            <button type="submit" className="checkout-button">Place Order</button>
                        </form>

                        <div className="shipping-section">
                            <h3 className="bold-text">Vận chuyển</h3>
                            <div className="shipping-info-box">Vui lòng nhập thông tin giao hàng</div>

                            <h3 className="bold-text">Thanh toán</h3>
                            <div className="p-4 border rounded-lg shadow-md">
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Chuyển khoản"
                                                checked={paymentMethod === 'Chuyển khoản'}
                                                onChange={handlePaymentChange}
                                                className="w-4 h-4"
                                            />
                                            <span>Chuyển khoản</span>
                                        </div>
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/128/3523/3523887.png"
                                            alt="bank"
                                            className="w-6 h-6"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Thu hộ (COD)"
                                                checked={paymentMethod === 'Thu hộ (COD)'}
                                                onChange={handlePaymentChange}
                                                className="w-4 h-4"
                                            />
                                            <span>Thu hộ (COD)</span>
                                        </div>
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/128/3523/3523887.png"
                                            alt="cod"
                                            className="w-6 h-6"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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