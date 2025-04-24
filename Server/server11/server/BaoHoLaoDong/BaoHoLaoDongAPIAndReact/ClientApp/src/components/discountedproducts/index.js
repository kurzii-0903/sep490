// src/components/discountedproducts/PoductSearch.js
import React, { useRef, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import './style.css';
import ProductPopup from "../productpopup";

export default function DiscountedProducts({products=[]}) {
    const scrollRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
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
                <div ref={scrollRef} className="flex overflow-x-auto space-x-4 product-container">
                    {products.map((product) => (
                        <div key={product.id} className="product-discounted-card">
                            <img src={product.image} alt={product.name} className="product-discounted-image" />
                            <div className="product-discounted-details">
                                <h3 className="product-discounted-name">{product.name}</h3>
                                <div className="product-discounted-prices">
                                    <p className="product-discount-price">{product.priceDiscount}</p>
                                    <p className="product-original-price">{product.price}</p>
                                </div>
                                <p className="product-discount-percentage">{product.discount}</p>
                                <button className="option-button" onClick={() => handleProductClick(product)}>Tùy chọn</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </div>
    );
}