import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import { CartContext } from "../../contexts/CartContext";

const CartDropdown = () => {
    const { cartItems, removeFromCart, updateCartItemQuantity } = useContext(CartContext);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            updateCartItemQuantity(itemId, newQuantity);
        } else {
            removeFromCart(itemId);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
                                <img src={item.productImages?.[0]?.image || "/images/default.png"} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <span className="cart-item-name">{item.name}</span>
                                    <span className="cart-item-variant">
                                        {item.productVariants?.[0] && (
                                        <p className="text-gray-500 text-sm">
                                            {item.productVariants[0].size} / {item.productVariants[0].color}
                                        </p>
                                    )}</span>
                                    <div className="cart-item-quantity">
                                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                    </div>
                                </div>
                                <div className="cart-item-price">
                                    {item.price.toLocaleString()}đ
                                    <FontAwesomeIcon icon={faTimes} className="cart-item-remove" onClick={() => removeFromCart(item.id)} />
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="empty-cart">
                        <img src="https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/empty-cart.png?1717815949845" alt="Empty Cart" className="empty-cart-image" />
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
                            <a href="/checkout" className="checkout-button-text">THANH TOÁN</a>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDropdown;