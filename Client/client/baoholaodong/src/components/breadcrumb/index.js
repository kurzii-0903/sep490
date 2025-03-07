import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbNameMap = {
        '/': 'Trang chủ',
        'about': 'Về chúng tôi',
        'products': 'Sản phẩm',
        'cart': 'Giỏ hàng',
        'blog': 'Kiến thức an toàn lao động',
        'login': 'Đăng nhập',
        'register': 'Đăng ký',
        'product': 'Chi tiết sản phẩm'
    };

    return (
        <div className="breadcrumb-container">
            <nav className="breadcrumb">
                <ul>
                    <li>
                        <Link to="/">{breadcrumbNameMap['/']}</Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        return (
                            <li key={to}>
                                <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Breadcrumb;