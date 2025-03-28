import React, { useState, useContext } from "react";
import { FaArrowRight, FaCheck, FaStar, FaCog, FaCartPlus } from "react-icons/fa";
import "./TopSaleProductsStyle.css";
import noImage from "../../images/no-image-product.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductPopup from "../../components/productpopup";
import { CartContext } from "../../contexts/CartContext";
import slugify from "slugify";

const TopSaleProducts = ({ products = [], title = "" }) => {
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 30;
    const filters = ["Giá tăng dần", "Giá giảm dần", "Rating"];
    const totalPages = Math.ceil(products.length / productsPerPage);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const sortedProducts = [...products];
    if (selectedFilter === "Giá tăng dần") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedFilter === "Giá giảm dần") {
        sortedProducts.sort((a, b) => b.price - b.price);
    } else if (selectedFilter === "Rating") {
        sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
    }

    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleDetailProduct = (product) => {
        window.location.href = `/products/${product.slug}`;
    };

    const handleProductClick = (product) => {
        if (product.productVariants.length > 0) {
            setSelectedProduct(product);
        } else {
            const cartItem = {
                id: product.id,
                name: product.name,
                image: product.image || noImage,
                quantity: 1,
                selectedVariant: null,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount || product.price,
                discount: product.discount || 0,
                quantityInStock: product.quantity, // Tồn kho
            };
            addToCart(cartItem);
        }
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4 filter-container" style={{ marginTop: "30px" }}>
                <h2 className="best-products">{title}</h2>
                <div className="flex space-x-4">
                    {filters.map((filter, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedFilter(filter)}
                            className={`filter-button ${selectedFilter === filter ? "selected" : ""}`}
                        >
                            {filter}
                            {selectedFilter === filter && <FaCheck className="ml-2 inline" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="product-container-best-products">
                {currentProducts.map((product, index) => (
                    <motion.div
                        key={index}
                        className="product-card"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="product-sale-image-container">
                            <img onClick={() => { handleDetailProduct(product) }}
                                 className="product-sale-image"
                                 src={product.image || noImage}
                                 alt={product.name}
                            />
                            <div className="product-sale-image-overlay">
                                <button
                                    className="product-sale-view-details-button"
                                    onClick={() => handleDetailProduct(product)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                        <div className="product-info">
                            <div className="product-rating">
                                {Array.from({ length: product.averageRating }, (_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">
                                {product.discount > 0 ? (
                                    <>
                                        <span className="text-red-500">{(product.priceAfterDiscount || (product.price - product.discount)).toLocaleString()}đ</span>
                                        <span className="text-gray-400 line-through ml-2">{product.price.toLocaleString()}đ</span>
                                        <p className="product-discount-percentage"> Giảm {product.discount} %</p>
                                    </>
                                ) : (
                                    <span>{product.price.toLocaleString()}đ</span>
                                )}
                            </div>
                            <div className="product-actions">
                                <button className="option-button" onClick={() => handleProductClick(product)}>
                                    {product.productVariants.length > 0 ? <><FaCog className="icon" />Tùy chọn</> : <><FaCartPlus className="icon" />Thêm vào giỏ hàng</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <div className="new-blog-read-more">
                    <button className="new-blog-read-more-button">
                        <div className="new-blog-read-more-text">Xem tất cả   <FaArrowRight className="inline" /></div>
                    </button>
                </div>
            </div>
            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </main>
    );
};

export default TopSaleProducts;