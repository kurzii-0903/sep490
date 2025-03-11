import React, { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './style.css';

const Checkout = () => {
    const { cartItems, totalPrice } = useContext(CartContext);
    const [shippingInfo, setShippingInfo] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order placed:', shippingInfo, cartItems, paymentMethod);
    };

    return (
        <div className="checkout-page">
            <div className="checkout-content">
                <div className="checkout-left">
                    <div className="logo-container">
                        <img src="http://baoholaodongminhxuan.com/images/common/logo1.gif" alt="Company Logo" className="company-logo" />
                    </div>
                    <div className="checkout-left-content">
                        <form className="shipping-form" onSubmit={handleSubmit}>
                            <h3 className="bold-text">Thông tin mua hàng</h3>
                            <input type="email" name="email" placeholder="Email" value={shippingInfo.email} onChange={handleInputChange} required />
                            <input type="text" name="name" placeholder="Họ và Tên" value={shippingInfo.name} onChange={handleInputChange} required />
                            <input type="text" name="phone" placeholder="Số điện thoại" value={shippingInfo.phone} onChange={handleInputChange} required />
                            <input type="text" name="address" placeholder="Địa chỉ" value={shippingInfo.address} onChange={handleInputChange} required />
                            <input type="text" name="city" placeholder="Tỉnh thành" value={shippingInfo.city} onChange={handleInputChange} required />
                            <input type="text" name="district" placeholder="Quận huyện" value={shippingInfo.district} onChange={handleInputChange} required />
                            <input type="text" name="ward" placeholder="Phường xã" value={shippingInfo.ward} onChange={handleInputChange} required />
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
                        <span className="total-quantity">({cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm)</span>
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
                </div>
            </div>
        </div>
    );
};

export default Checkout;