import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const [productDetails, setProductDetails] = useState(null);

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

    useEffect(() => {
        const fetchProductDetails = async (productId) => {
            try {
                const response = await fetch(`http://localhost:5000/api/Product/get-product-by-id/${productId}`);
                const data = await response.json();
                setProductDetails(data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (pathnames[0] === 'product' && pathnames[1]) {
            fetchProductDetails(pathnames[1]);
        }
    }, [pathnames]);

    return (
        <div className="breadcrumb-container">
            <nav className="breadcrumb">
                <ul>
                    <li>
                        <Link to="/">{breadcrumbNameMap['/']}</Link>
                    </li>
                    {pathnames.map((value, index) => {
                        if (value === 'product' && productDetails) {
                            return (
                                <React.Fragment key={value}>
                                    <li>
                                        <Link to={`/category/${productDetails.categoryId}`}>
                                            {productDetails.categoryName}
                                        </Link>
                                    </li>
                                    <li>
                                        <span>{productDetails.name}</span>
                                    </li>
                                </React.Fragment>
                            );
                        } else if (index === pathnames.length - 1 && productDetails) {
                            return null;
                        } else if (value !== pathnames[1]) {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            return (
                                <li key={to}>
                                    <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Breadcrumb;