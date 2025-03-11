import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import {FaFilter, FaCartPlus, FaRegFrown} from 'react-icons/fa';
import { CustomerProductContext } from '../../contexts/CustomerProductContext';
import {useLocation, useParams} from "react-router-dom";
import {motion} from 'framer-motion';
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ProductList = () => {
    const query = useQuery();
    const search = query.get("search");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const { groupCategories,searchProduct } = useContext(CustomerProductContext);

    const priceFilters = [
        "Dưới 1 triệu",
        "1 triệu - 3 triệu",
        "3 triệu - 5 triệu",
        "Trên 5 triệu",
    ];

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter)
                ? prev.filter((item) => item !== filter)
                : [...prev, filter]
        );
    };
    useEffect(() => {
        let isMounted = true; // Biến kiểm soát unmounting
        const fetchProducts = async () => {
            if (search?.trim()) {
                const result = await searchProduct(search);
                if (isMounted) {
                    setProducts(result || []);
                }
            } else {
                setProducts([]);
            }
        };
        fetchProducts();
        return () => {
            isMounted = false; // Cleanup effect
        };
    }, [search]);


    return (
        <div className="product-list-page">
            <h1 className="page-title">Trang Thiết Bị Bảo Hộ</h1>
            <div className="banner">
                <img src="https://bhld.net/wp-content/uploads/2015/01/banner-mu-bhld-1.jpg" alt="Banner" />
            </div>
            <div className="content">
                <div className="filter-section">
                    <div className="product-filter">
                        <div className="filter-header">
                            <FaFilter className="filter-icon" />
                            <span className="filter-title">BỘ LỌC SẢN PHẨM</span>
                        </div>
                        <div className="filter-options">
                            <h3 className="filter-subtitle">Chọn Mức Giá</h3>
                            {priceFilters.map((filter, index) => (
                                <label key={index} className="filter-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.includes(filter)}
                                        onChange={() => handleFilterChange(filter)}
                                        className="filter-checkbox"
                                    />
                                    <span>{filter}</span>
                                </label>
                            ))}
                        </div>
                        <hr className="filter-divider" />
                        <div className="filter-options">
                            <h3 className="filter-subtitle">Loại Sản Phẩm</h3>
                            {groupCategories.map((group, index) => (
                                <div key={index}>
                                    <h4>{group.groupName}</h4>
                                    {group.categories.map((category, catIndex) => (
                                        <label key={catIndex} className="filter-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes(category.categoryName)}
                                                onChange={() => handleFilterChange(category.categoryName)}
                                                className="filter-checkbox"
                                            />
                                            <span>{category.categoryName}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="product-section">
                    {products.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <FaRegFrown className="text-gray-500 w-12 h-12"/>
                            <span className="text-gray-500 ml-4">Không có sản phẩm nào</span>
                        </div>
                    ) : (
                        <motion.div
                            className="product-list"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
                                exit: { opacity: 0, y: -20 }
                            }}
                        >
                            {products.map(({ id, name, image, price }, index) => (
                                <motion.div
                                    key={id}
                                    className="product-list-item"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                        exit: { opacity: 0, y: -20 }
                                    }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <img src={image} alt={name} className="product-image" />
                                    <h3 className="product-list-name">{name}</h3>
                                    <p className="product-list-price">{price.toLocaleString()} VND</p>
                                    <button className="add-to-cart-button-product-list">
                                        <FaCartPlus className="add-to-cart-icon" />
                                        <span className="add-to-cart-text">Thêm vào giỏ</span>
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductList;