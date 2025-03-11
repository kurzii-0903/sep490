import React, { useState } from 'react';

const CustomerInfo = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        ward: '',
        city: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý dữ liệu form ở đây
        console.log(formData);
    };


    return (
        <div className="customer-info">
            <h1>Thông Tin Khách Hàng</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tên công ty</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Địa chỉ giao hàng</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Quận/Huyện</label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phường/Xã</label>
                    <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tỉnh/Thành phố</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="Hanoi">Hà Nội</option>
                        <option value="HCM">Hồ Chí Minh</option>
                        {/* Thêm các tỉnh/thành phố khác tại đây */}
                    </select>
                </div>
                <button type="submit">Xác nhận thông tin</button>
            </form>
        </div>
    );
};


export default CustomerInfo;
