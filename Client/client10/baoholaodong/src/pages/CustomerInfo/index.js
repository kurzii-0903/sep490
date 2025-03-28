import React, { useState } from 'react';
import './style.css';

const CustomerInfo = () => {
    const [formData, setFormData] = useState({
        FullName: '',
        Gender: 1, // Default to Nam (1)
        DateOfBirth: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        AccountStatus: 'Đã kích hoạt', // Simulated account status
        RegistrationDate: new Date().toLocaleDateString('vi-VN'), // Simulated registration date
    });

    const [orders, setOrders] = useState([
        {
            OrderId: 101,
            ProductName: 'Mũ bảo hộ đen',
            ProductPrice: 150000,
            ProductDiscount: 10.00,
            Quantity: 2,
            TotalPrice: 270000, // (150 - 10% discount) * 2 = 270
            Size: 'M',
            Color: 'Đen',
        },
        {
            OrderId: 102,
            ProductName: 'Quần áo bảo hộ xanh',
            ProductPrice: 300000,
            ProductDiscount: null,
            Quantity: 1,
            TotalPrice: 300000, // No discount, so 300 * 1 = 300
            Size: 'S',
            Color: 'Xanh',
        },
    ]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            setFormData({
                ...formData,
                Gender: value === '1' ? 1 : 0,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Customer Info:', formData);
    };

    // Random user profile image (simulating a user profile picture)
    const randomProfileImage = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;

    return (
        <div className="customer-info-page">
            <div className="customer-info">
                <div className="breadcrumb">
                    <a href="/">Trang chủ</a> &gt; Thông Tin Khách Hàng
                </div>

                <h1>THÔNG TIN KHÁCH HÀNG</h1>
                <p className="subtitle">Vui lòng điền đầy đủ thông tin đặt hàng</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên *</label>
                        <input
                            type="text"
                            name="FullName"
                            value={formData.FullName}
                            onChange={handleChange}
                            placeholder="Nguyen Van A"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Giới tính</label>
                        <div className="gender-options">
                            <label>
                                <input
                                    type="radio"
                                    name="Gender"
                                    value="1"
                                    checked={formData.Gender === 1}
                                    onChange={handleChange}
                                /> Nam
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="Gender"
                                    value="0"
                                    checked={formData.Gender === 0}
                                    onChange={handleChange}
                                /> Nũ
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="DateOfBirth"
                            value={formData.DateOfBirth}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="PhoneNumber"
                            value={formData.PhoneNumber}
                            onChange={handleChange}
                            placeholder="0912345678"
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ *</label>
                        <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            placeholder="Số nhà, đường, phố..."
                            required
                        />
                    </div>
                    <button type="submit">Xác nhận thông tin</button>
                </form>

                {/* Updated Customer Information Display */}
                {formData.FullName && (
                    <div className="customer-details">
                        <h2>Thông Tin Khách Hàng</h2>
                        <div className="profile-section">
                            <div className="profile-image">
                                <img
                                    src={randomProfileImage}
                                    alt="Profile"
                                    className="profile-img"
                                />
                            </div>
                            <div className="profile-info">
                                <p><strong>Họ và tên:</strong> {formData.FullName}</p>
                                <p><strong>Giới tính:</strong> {formData.Gender === 0 ? 'Nữ' : formData.Gender === 1 ? 'Nam' : 'Chưa chọn'}</p>
                                <p><strong>Ngày sinh:</strong> {formData.DateOfBirth || 'Chưa cung cấp'}</p>
                                <p><strong>Email:</strong> {formData.Email}</p>
                                <p><strong>Số điện thoại:</strong> {formData.PhoneNumber || 'Chưa cung cấp'}</p>
                                <p><strong>Địa chỉ:</strong> {formData.Address || 'Chưa cung cấp'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order List */}
                <div className="order-list">
                    <h2>Lịch Sử Đặt Hàng</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Mã Đơn Hàng</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Kích Thước</th>
                            <th>Màu Sắc</th>
                            <th>Giảm Giá (%)</th>
                            <th>Giá Sản Phẩm</th>
                            <th>Tổng Giá</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.OrderId}>
                                <td>{order.OrderId}</td>
                                <td>{order.ProductName}</td>
                                <td>{order.Quantity}</td>
                                <td>{order.Size || 'Không có'}</td>
                                <td>{order.Color || 'Không có'}</td>
                                <td>{order.ProductDiscount ? `${order.ProductDiscount.toFixed(2)}%` : 'Không có'}</td>
                                <td>{order.ProductPrice.toFixed(2)} VND</td>
                                <td>{order.TotalPrice.toFixed(2)} VND</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;