import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import { CartContext } from "../../contexts/CartContext";
import noImage from "../../images/no-image-product.jpg";

const CartDropdown = () => {
    const { cartItems, removeFromCart, updateCartItemQuantity } = useContext(CartContext);

    const handleQuantityChange = (itemId, selectedVariant, newQuantity) => {
        if (newQuantity > 0) {
            updateCartItemQuantity(itemId, newQuantity, selectedVariant);
        } else {
            removeFromCart(itemId, selectedVariant);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.finalPrice * item.quantity, 0);

    return (
        <div className="cart-dropdown">
            {cartItems.length > 0 && (
                <div className="cart-header">
                    <h3 className="cart-title">GIỎ HÀNG</h3>
                </div>
            )}
            <div className="cart-items-container">
                {cartItems.length ? (
                    <>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img
                                    src={item.image || noImage} // Sử dụng noImage thay vì "/images/default.png"
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <span className="cart-item-name">{item.name}</span>
                                    <span className="cart-item-variant">
                                        {item.selectedVariant && (
                                            <p className="text-gray-500 text-sm">
                                                {item.selectedVariant.size && item.selectedVariant.color && (
                                                    <span>{item.selectedVariant.size} / {item.selectedVariant.color}</span>
                                                )}
                                            </p>
                                        )}
                                    </span>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.selectedVariant, item.quantity - 1)}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.selectedVariant, item.quantity + 1)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                    </div>
                                </div>
                                <div className="cart-item-price">
                                    <span className="text-red-500">{(item.finalPrice * item.quantity).toLocaleString()}đ</span>
                                    {item.totalTax > 0 && (
                                        <span className="text-gray-500 text-sm"> (Bao gồm thuế: {item.totalTax.toLocaleString()}đ)</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="empty-cart">
                        <img
                            src="https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/empty-cart.png?1717815949845"
                            alt="Empty Cart"
                            className="empty-cart-image"
                        />
                        <span className="empty-message">Không có sản phẩm nào trong giỏ hàng của bạn</span>
                    </div>
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total-container">
                        <div className="cart-total">
                            <span className="total-label">Tổng tiền:</span>
                            <span className="total-price">{totalPrice.toLocaleString()}đ</span>
                        </div>
                        <button className="checkout-button">
                            <a href="/cart" className="checkout-button-text">Xem Giỏ Hàng</a>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDropdown;