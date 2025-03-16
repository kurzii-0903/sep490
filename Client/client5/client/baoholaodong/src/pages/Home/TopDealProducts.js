import React, { useRef, useState, useContext } from "react";
import { FaArrowRight, FaArrowLeft, FaCog, FaCartPlus } from "react-icons/fa";
import './TopDealProductsStyle.css';
import ProductPopup from "../../components/productpopup";
import { CartContext } from "../../contexts/CartContext";

export default function TopDealProducts({ products = [] }) {
    const scrollRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useContext(CartContext);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            quantity: 1
        });
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
                                    <p className="product-discount-price">
                                        {product.price - product.discount}
                                    </p>
                                    <p className="product-original-price">{product.price}</p>
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