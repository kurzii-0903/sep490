import React, { useState, useContext } from "react";
import { Minus, Plus } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import './style.css';
import noImage from "../../images/no-image-product.jpg";
import { CartContext } from "../../contexts/CartContext";
import ProductVariantSelector from "../../pages/ProductDetails/ProductVariantSelector";

const ProductPopup = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);
    const [selectedVariant, setSelectedVariant] = useState(null);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart({ ...product, selectedVariant, quantity });
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="popup-product-container">
                    <img
                        src={product.image || noImage}
                        alt={product.name}
                        className="popup-product-image"
                    />
                    <div className="popup-product-details">
                        <h3 className="popup-product-name">{product.name}</h3>
                        <p className="popup-product-price">
                            {selectedVariant?.discount > 0 ? (
                                <>
                                    <span className="text-red-500">
                                        {(selectedVariant.price - (selectedVariant.price * selectedVariant.discount / 100)).toLocaleString()}đ
                                    </span>
                                    <span className="text-gray-400 line-through ml-2">
                                        {selectedVariant.price.toLocaleString()}đ
                                    </span>
                                </>
                            ) : (
                                <span>{(selectedVariant?.price || product.price).toLocaleString()}đ</span>
                            )}
                        </p>
                        <ProductVariantSelector product={product} setSelectedVariant={setSelectedVariant} />
                        <div className="flex items-center mt-4">
                            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="quantity-button">
                                <Minus size={16} />
                            </button>
                            <span className="mx-3 text-lg font-semibold">{quantity}</span>
                            <button onClick={() => setQuantity((prev) => prev + 1)} className="quantity-button">
                                <Plus size={16} />
                            </button>
                        </div>
                        <button className="add-to-cart-popup" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;