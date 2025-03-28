import React, { useRef, useState, useContext } from "react";
import { FaArrowRight, FaArrowLeft, FaCog, FaCartPlus } from "react-icons/fa";
import './TopDealProductsStyle.css';
import ProductPopup from "../../components/productpopup";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import noImage from "../../images/no-image-product.jpg"; // Thêm import nếu cần

export default function TopDealProducts({ products = [] }) {
    const scrollRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image || noImage,
            quantity: 1, // Chỉ thêm 1 đơn vị
            selectedVariant: null, // Không có variant
            price: product.price,
            priceAfterDiscount: product.priceAfterDiscount || product.price,
            discount: product.discount || 0,
            quantityInStock: product.quantity, // Lưu tồn kho riêng
        };
        addToCart(cartItem);
    };

    const handleDetailProduct = (product) => {
        navigate(`/products/${product.slug}`);
    };

    return (
        <div className="deal">
            <div className="container flex">
                <div className="deal-info flex flex-col items-center">
                    <h2 className="deal-title-text"><span className="highlight">"BÃO</span> DEAL" GIẢM GIÁ</h2>
                    <div className="navigate-button-container">
                        <button onClick={scrollLeft} className="navigate-button">
                            <FaArrowLeft />
                        </button>
                        <button onClick={scrollRight} className="navigate-button">
                            <FaArrowRight />
                        </button>
                    </div>
                    <button className="view-all-button mt-4">Xem tất cả <FaArrowRight className="inline" /></button>
                </div>
                <div ref={scrollRef} className="flex overflow-x-auto space-x-5 product-container">
                    {products.map((product) => (
                        <div key={product.id} className="product-discounted-card">
                            <div className="product-discounted-image-container">
                                <img
                                    src={product.image || noImage}
                                    alt={product.name}
                                    className="product-discounted-image"
                                    onClick={() => handleDetailProduct(product)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="product-discounted-image-overlay">
                                    <button
                                        className="product-discounted-view-details-button"
                                        onClick={() => handleDetailProduct(product)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                            <div className="product-discounted-details">
                                <h3 className="product-discounted-name">{product.name}</h3>
                                <div className="product-discounted-prices">
                                    <p className="product-discount-price">
                                        {(product.priceAfterDiscount || (product.price - product.discount)).toLocaleString()}đ
                                    </p>
                                    <p className="product-original-price">{product.price.toLocaleString()}đ</p>
                                </div>
                                <p className="product-discount-percentage"> Giảm {product.discount} %</p>
                                {product.productVariants && product.productVariants.length > 0 ? (
                                    <button className="option-button" onClick={() => handleProductClick(product)}>
                                        <FaCog className="icon" /> Tùy chọn
                                    </button>
                                ) : (
                                    <button className="option-button" onClick={() => handleAddToCart(product)}>
                                        <FaCartPlus className="icon" /> Thêm vào giỏ hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </div>
    );
}