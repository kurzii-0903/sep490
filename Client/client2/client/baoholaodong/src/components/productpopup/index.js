import React, { useState, useContext } from "react";
import { Minus, Plus } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import './style.css';
import noImage from "../../images/no-image-product.jpg";
import { CartContext } from "../../contexts/CartContext";

const ProductPopup = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    // Extract sizes and colors from productVariants
    const sizes = [...new Set(product.productVariants.map(variant => variant.size))];
    const colors = [...new Set(product.productVariants.map(variant => variant.color))];

    const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null);
    const [selectedColor, setSelectedColor] = useState(colors.length > 0 ? colors[0] : null);

    if (!product) return null;

    const handleAddToCart = () => {
        const selectedVariant = product.productVariants.find(
            variant => variant.size === selectedSize && variant.color === selectedColor
        );
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
                            {product.discount > 0 ? (
                                <>
                                    <span className="text-red-500">{product.price - product.discount}</span>
                                    <span className="text-gray-400 line-through ml-2">{product.price}</span>
                                </>
                            ) : (
                                <span>{product.price}</span>
                            )}
                        </p>
                        {colors.length > 0 && (
                            <div className="mt-2">
                                <p className="font-medium">Màu sắc:</p>
                                <div className="flex gap-2 mt-1">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-transparent"}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {sizes.length > 0 && (
                            <div className="mt-3">
                                <p className="font-medium">Kích thước:</p>
                                <div className="flex gap-2 mt-1">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`px-3 py-1 border rounded-md ${selectedSize === size ? "bg-black text-white" : "bg-gray-200"}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
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